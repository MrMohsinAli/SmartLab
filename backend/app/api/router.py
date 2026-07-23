from fastapi import APIRouter
from app.api.endpoints import patients, prescriptions, blood_reports

api_router = APIRouter()

api_router.include_router(patients.router, prefix="/patients", tags=["Patients"])
api_router.include_router(prescriptions.router, prefix="/prescriptions", tags=["Prescriptions"])
api_router.include_router(blood_reports.router, prefix="/blood-reports", tags=["Blood Reports"])

@api_router.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "smartlab api",
        "version": "1.0.0"
    }

