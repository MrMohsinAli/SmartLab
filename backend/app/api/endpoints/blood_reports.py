import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models import BloodReport, Patient
from app.services.tasks import process_blood_report_task

router = APIRouter()
UPLOAD_DIR = os.path.join("uploads", "blood_reports")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", status_code=201)
def upload_blood_report(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    patient_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    allowed_extensions = {".jpg", ".jpeg", ".png", ".pdf"}
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only image files or PDFs are allowed."
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
    db_report = BloodReport(
        patient_id=patient_uuid,
        file_name=file.filename,
        file_path=file_path,
        status="PENDING"
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    # Enqueue OCR in background
    background_tasks.add_task(process_blood_report_task, db_report.id, db)
    return {
        "id": str(db_report.id),
        "patient_id": str(db_report.patient_id) if db_report.patient_id else None,
        "file_name": db_report.file_name,
        "file_path": db_report.file_path,
        "status": db_report.status,
        "detected_patient_name": db_report.detected_patient_name,
        "uploaded_at": db_report.uploaded_at.isoformat() if db_report.uploaded_at else None
    }

@router.get("/")
def list_blood_reports(patient_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(BloodReport)
    if patient_id:
        try:
            p_uuid = uuid.UUID(patient_id)
            query = query.filter(or_(BloodReport.patient_id == p_uuid, BloodReport.patient_id.is_(None)))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid patient_id format.")
            
    reports = query.order_by(BloodReport.uploaded_at.desc()).all()
    result = []
    for r in reports:
        bms = [
            {
                "id": str(b.id),
                "name": b.name,
                "value": b.value,
                "unit": b.unit,
                "reference_range": f"{b.reference_range_min} - {b.reference_range_max}" if b.reference_range_min is not None and b.reference_range_max is not None else "",
                "reference_range_min": b.reference_range_min,
                "reference_range_max": b.reference_range_max,
                "status": b.status,
                "educational_tip": b.educational_tip
            }
            for b in r.biomarkers
        ]
        result.append({
            "id": str(r.id),
            "patient_id": str(r.patient_id) if r.patient_id else None,
            "file_name": r.file_name,
            "status": r.status,
            "raw_text": r.raw_text,
            "detected_patient_name": r.detected_patient_name,
            "uploaded_at": r.uploaded_at.isoformat() if r.uploaded_at else None,
            "biomarkers": bms
        })
    return result

@router.get("/{id}")
def get_blood_report(id: str, db: Session = Depends(get_db)):
    try:
        report_uuid = uuid.UUID(id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid blood report id format.")
    
    r = db.query(BloodReport).filter(BloodReport.id == report_uuid).first()
    if not r:
        raise HTTPException(status_code=404, detail="Blood report not found.")
    
    bms = [
        {
            "id": str(b.id),
            "name": b.name,
            "value": b.value,
            "unit": b.unit,
            "reference_range": f"{b.reference_range_min} - {b.reference_range_max}" if b.reference_range_min is not None and b.reference_range_max is not None else "",
            "reference_range_min": b.reference_range_min,
            "reference_range_max": b.reference_range_max,
            "status": b.status,
            "educational_tip": b.educational_tip
        }
        for b in r.biomarkers
    ]
    return {
        "id": str(r.id),
        "patient_id": str(r.patient_id) if r.patient_id else None,
        "file_name": r.file_name,
        "status": r.status,
        "raw_text": r.raw_text,
        "detected_patient_name": r.detected_patient_name,
        "uploaded_at": r.uploaded_at.isoformat() if r.uploaded_at else None,
        "biomarkers": bms
    }
