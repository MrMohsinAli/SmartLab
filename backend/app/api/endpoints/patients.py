import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Patient

router = APIRouter()
class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    email: Optional[str] = None
class PatientResponse(BaseModel):
    id: uuid.UUID
    first_name: str
    last_name: str
    email: Optional[str]
    
@router.post("/", response_model=PatientResponse, status_code=201)
def create_patient(patient_in: PatientCreate, db: Session = Depends(get_db)):
    if patient_in.email:
        existing = db.query(Patient).filter(Patient.email == patient_in.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered.")
#Create db record           
    db_patient = Patient(
        first_name=patient_in.first_name,
        last_name=patient_in.last_name,
        email=patient_in.email
    )
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

