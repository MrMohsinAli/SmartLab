import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models import Prescription, Patient
from app.services.tasks import process_prescription_task

router = APIRouter()
UPLOAD_DIR = os.path.join("uploads", "prescriptions")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", status_code=201)
def upload_prescription(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    patient_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    allowed_extensions = {".jpg", ".jpeg", ".png"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only image files are allowed."
        )
    patient_uuid = None
    if patient_id:
        try:
            patient_uuid = uuid.UUID(patient_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid patient_id format.")
        
        patient = db.query(Patient).filter(Patient.id == patient_uuid).first()
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found.")
            
    # Create unique filename
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file locally
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
        
    # Create db record
    db_prescription = Prescription(
        patient_id=patient_uuid,
        file_name=file.filename,
        file_path=file_path,
        status="PENDING"
    )
    db.add(db_prescription)
    db.commit()
    db.refresh(db_prescription)
    
    # Enqueue OCR in background
    background_tasks.add_task(process_prescription_task, db_prescription.id, db)
    return {
        "id": str(db_prescription.id),
        "patient_id": str(db_prescription.patient_id) if db_prescription.patient_id else None,
        "file_name": db_prescription.file_name,
        "file_path": db_prescription.file_path,
        "status": db_prescription.status,
        "detected_patient_name": db_prescription.detected_patient_name,
        "uploaded_at": db_prescription.uploaded_at.isoformat() if db_prescription.uploaded_at else None
    }

@router.get("/")
def list_prescriptions(patient_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Prescription)
    if patient_id:
        try:
            p_uuid = uuid.UUID(patient_id)
            query = query.filter(or_(Prescription.patient_id == p_uuid, Prescription.patient_id.is_(None)))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid patient_id format.")
            
    prescriptions = query.order_by(Prescription.uploaded_at.desc()).all()
    result = []
    for p in prescriptions:
        meds = [
            {
                "id": str(m.id),
                "drug_name": m.drug_name,
                "dosage": m.dosage,
                "interval": m.interval,
                "duration": m.duration
            }
            for m in p.medications
        ]
        result.append({
            "id": str(p.id),
            "patient_id": str(p.patient_id) if p.patient_id else None,
            "file_name": p.file_name,
            "status": p.status,
            "raw_text": p.raw_text,
            "detected_patient_name": p.detected_patient_name,
            "uploaded_at": p.uploaded_at.isoformat() if p.uploaded_at else None,
            "medications": meds
        })
    return result

@router.get("/{id}")
def get_prescription(id: str, db: Session = Depends(get_db)):
    try:
        prescription_uuid = uuid.UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid prescription id format.")
    
    p = db.query(Prescription).filter(Prescription.id == prescription_uuid).first()
    if not p:
        raise HTTPException(status_code=404, detail="Prescription not found.")
    
    meds = [
        {
            "id": str(m.id),
            "drug_name": m.drug_name,
            "dosage": m.dosage,
            "interval": m.interval,
            "duration": m.duration
        }
        for m in p.medications
    ]
    return {
        "id": str(p.id),
        "patient_id": str(p.patient_id) if p.patient_id else None,
        "file_name": p.file_name,
        "status": p.status,
        "raw_text": p.raw_text,
        "detected_patient_name": p.detected_patient_name,
        "uploaded_at": p.uploaded_at.isoformat() if p.uploaded_at else None,
        "medications": meds
    }
