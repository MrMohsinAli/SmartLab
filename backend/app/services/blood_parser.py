import json
from google import genai
from pydantic import BaseModel
from typing import List, Optional
from app.config import settings

class BiomarkerSchema(BaseModel):
    name: str
    value: float
    unit: str

class BloodExtractionSchema(BaseModel):
    biomarkers: List[BiomarkerSchema]

def parse_blood_report_text(raw_text: str) -> List[BiomarkerSchema]:
    if not settings.GOOGLE_API_KEY:
        raise ValueError("GOOGLE_API_KEY is not configured in settings.")
        
    client = genai.Client(api_key=settings.GOOGLE_API_KEY)
    prompt = ("You are an expert clinical laboratory data extraction system. Parse the following unstructured "
        "raw text from a blood test report and extract all listed biomarkers (lab tests). "
        "For each biomarker, identify the biomarker name, the measured numerical value (must be float), "
        "and the measurement unit (e.g., 'g/dL', 'mg/dL', 'cells/mcL'). "
        "Ensure names are cleaned and standardized (e.g., convert common abbreviations to standard terms if possible).")
    
    response = client.models.generate_content(
        model='gemini-3.5-flash-lite',
        contents=raw_text,
        config=dict(
            response_mime_type="application/json",
            response_schema=BloodExtractionSchema,
            system_instruction=prompt
        ),
    )
    data = json.loads(response.text)
    extracted_data = BloodExtractionSchema(**data)
    return extracted_data.biomarkers
