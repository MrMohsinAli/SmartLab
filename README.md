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

## Day 2: Structured Medication Parser (7/28/2026)

---

1. Created `parser.py`utilizing the Google gemini structured JSON outputs to extract structured medication data from the raw OCR text.
2. Updated `tasks.py` to automatically send raw OCR prescription text to the parser and map it to structured medication profiles.
3. Programmed the pipeline to loop through all parsed medications and save them as individual rows in the `medications` database table.
4. Tested the integration, but the transcription is not accurate for now.

---

