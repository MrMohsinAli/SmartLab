import logging
from uuid import UUID
from sqlalchemy.orm import Session
from app.models import Prescription, BloodReport
from app.services.ocr import extract_text_from_image

logger = logging.getLogger("smartlab.tasks")

def process_prescription_task(prescription_id: UUID, db: Session):
    logger.info(f"Starting prescription processing task for ID: {prescription_id}")
    prescription = db.query(Prescription).filter(Prescription.id == prescription_id).first()
    if not prescription:
        logger.error(f"Prescription with ID {prescription_id} not found.")
        return
    try:
        prescription.status = "PROCESSING"
        db.commit()
# Call OCR transcription service
        raw_text = extract_text_from_image(prescription.file_path)
        prescription.raw_text = raw_text
        db.commit()
    # Call parser to extract structured medications
        from app.services.parser import parse_prescription_text
        from app.models import Medication
        medications_data = parse_prescription_text(raw_text)
        # Save each structured medication to the database
        for med_data in medications_data:
            db_med = Medication(
                prescription_id=prescription.id,
                drug_name=med_data.drug_name,
                dosage=med_data.dosage,
                interval=med_data.interval,
                duration=med_data.duration
            )
            db.add(db_med)
        prescription.status = "COMPLETED"
        db.commit()
        logger.info(f"Successfully completed prescription processing task for ID: {prescription_id}")
    except Exception as e:
        logger.exception(f"Failed to process prescription task for ID: {prescription_id}")
        prescription.status = "FAILED"
        db.commit()

def process_blood_report_task(report_id: UUID, db: Session):
    logger.info(f"Starting blood report OCR task for ID: {report_id}")
    report = db.query(BloodReport).filter(BloodReport.id == report_id).first()
    if not report:
        logger.error(f"Blood report with ID {report_id} not found.")
        return
    try:
        report.status = "PROCESSING"
        db.commit()
# Call OCR transcription service
        raw_text = extract_text_from_image(report.file_path)
        report.raw_text = raw_text
        report.status = "COMPLETED"
        db.commit()
        logger.info(f"Successfully completed blood report OCR task for ID: {report_id}")
    except Exception as e:
        logger.exception(f"Failed to process blood report OCR task for ID: {report_id}")
        report.status = "FAILED"
        db.commit()
