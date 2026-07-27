# SmartLab

---
## MODULE 2
---

## Day 1: Handwriting OCR Transcription Pipeline (7/27/2026)

---

1. Added `google-genai` and `pillow` to requirements.txt and installed them.
2. Created `ocr.py`which uses the Google Gemini gemini-3.5-flash-lite model to transcribe both images and PDFs.
3. Configured `prescriptions.py`and `blood_reports.py`to trigger transcription in the background immediately upon upload.
4. Created `tasks.py` which coordinates reading files, sending them to the OCR service, and updating PostgreSQL state transitions (PENDING -> PROCESSING -> COMPLETED / FAILED).

---
