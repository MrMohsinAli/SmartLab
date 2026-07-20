from fastapi import APIRouter

api_router = APIRouter()

@api_router.get("/health", tags=["Health"])
def health_check():
    """
    Health check endpoint to verify backend status.
    """
    return {
        "status": "healthy",
        "service": "smartlab api",
        "version": "1.0.0"
    }
