import json
import logging
from openai import OpenAI
from google import genai
from pydantic import BaseModel
from typing import List, Optional
from app.config import settings

logger = logging.getLogger("smartlab.parser")

class MedicationSchema(BaseModel):
    drug_name: str
    dosage: Optional[str] = None
    interval: Optional[str] = None
    duration: Optional[str] = None
    
class PrescriptionExtractionSchema(BaseModel):
    medications: List[MedicationSchema]

def parse_prescription_text(raw_text: str) -> List[MedicationSchema]:
    if settings.OPENAI_API_KEY:
        try:
            logger.info("Attempting structured parsing using OpenAI (gpt-4o-mini)...")
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            prompt = ("You are an expert medical transcriptionist. Parse the following unstructured raw text "
                      "extracted from a handwritten doctor prescription and extract all listed medications. "
                      "For each medication, identify the drug name, dosage (strength/quantity, e.g. '500mg', '1 tab'), "
                      "interval (frequency, e.g. 'once daily', 'every 8 hours'), and duration (e.g. '5 days'). "
                      "Correct any obvious OCR typos in drug names to make sure they match real medicine names.")
            completion = client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": raw_text}
                ],
                response_format=PrescriptionExtractionSchema
            )
            logger.info("OpenAI parsing successful.")
            return completion.choices[0].message.parsed.medications
        except Exception as e:
            logger.warning(f"OpenAI parsing failed: {str(e)}. Falling back to Gemini...")

    if settings.GOOGLE_API_KEY:
        logger.info("Attempting structured parsing using Google Gemini (gemini-3.5-flash-lite)...")
        client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        prompt = ("You are an expert medical transcriptionist. Parse the following unstructured raw text "
                  "extracted from a handwritten doctor prescription and extract all listed medications. "
                  "For each medication, identify the drug name, dosage (strength/quantity, e.g. '500mg', '1 tab'), "
                  "interval (frequency, e.g. 'once daily', 'every 8 hours'), and duration (e.g. '5 days'). "
                  "Correct any obvious OCR typos in drug names to make sure they match real medicine names.")
        response = client.models.generate_content(
            model='gemini-3.5-flash-lite',
            contents=raw_text,
            config=dict(
                response_mime_type="application/json",
                response_schema=PrescriptionExtractionSchema,
                system_instruction=prompt
            ),
        )
        data = json.loads(response.text)
        extracted_data = PrescriptionExtractionSchema(**data)
        logger.info("Gemini parsing successful.")
        return extracted_data.medications
        
    raise ValueError("Neither OpenAI nor Google API keys functional.")
