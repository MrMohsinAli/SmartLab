import uuid
from sqlalchemy import Column, String, ForeignKey, Text, DateTime, Float, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

#create patients table
class Patient(Base):
    __tablename__ = "patients"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=True, unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    prescriptions = relationship("Prescription", back_populates="patient", cascade="all, delete-orphan")
    blood_reports = relationship("BloodReport", back_populates="patient", cascade="all, delete-orphan")

#create prescription table
class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="SET NULL"), nullable=True)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    status = Column(String, nullable=False, default="PENDING")  # "PENDING","PROCESSING","COMPLETED","FAILED"
    raw_text = Column(Text, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("Patient", back_populates="prescriptions")
    medications = relationship("Medication", back_populates="prescription", cascade="all, delete-orphan")

#create medications table
class Medication(Base):
    __tablename__ = "medications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prescription_id = Column(UUID(as_uuid=True), ForeignKey("prescriptions.id", ondelete="CASCADE"), nullable=False)
    drug_name = Column(String, nullable=False)
    dosage = Column(String, nullable=True)
    interval = Column(String, nullable=True)
    duration = Column(String, nullable=True)

    prescription = relationship("Prescription", back_populates="medications")

#create blood report table
class BloodReport(Base):
    __tablename__ = "blood_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("patients.id", ondelete="SET NULL"), nullable=True)
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    status = Column(String, nullable=False, default="PENDING")  # "PENDING","PROCESSING","COMPLETED","FAILED"
    raw_text = Column(Text, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    patient = relationship("Patient", back_populates="blood_reports")
    biomarkers = relationship("Biomarker", back_populates="blood_report", cascade="all, delete-orphan")

#create biomarkers table
class Biomarker(Base):
    __tablename__ = "biomarkers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    blood_report_id = Column(UUID(as_uuid=True), ForeignKey("blood_reports.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    reference_range_min = Column(Float, nullable=True)
    reference_range_max = Column(Float, nullable=True)
    status = Column(String, nullable=False, default="NORMAL")  # "NORMAL","ABNORMAL","CRITICAL"
    educational_tip = Column(Text, nullable=True)

    blood_report = relationship("BloodReport", back_populates="biomarkers")
