import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import BloodReport, Patient

router = APIRouter()
UPLOAD_DIR = os.path.join("uploads", "blood_reports")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", status_code=201)
def upload_blood_report(
    file: UploadFile = File(...),
    patient_id: str = None,
    db: Session = Depends(get_db)
):
    allowed_extensions = {".jpg",".jpeg",".png",".pdf"}
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
    return {
        "id": str(db_report.id),
        "patient_id": str(db_report.patient_id) if db_report.patient_id else None,
        "file_name": db_report.file_name,
        "file_path": db_report.file_path,
        "status": db_report.status,
        "uploaded_at": db_report.uploaded_at
    }
