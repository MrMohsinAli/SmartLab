# SmartLab

---
## MODULE 1
---

## Day 1: Backend Initialization (7/20/2026)

---

1. Created backend Structure.
2. Created `main.py` to initialize the FastAPI app.
3. Created `router.py` to handle modular route logic.
4. Set up the `requirements.txt` file specifying core requirements (`fastapi`, `uvicorn`, `pydantic`).
5. Created virtual environment to check if FastAPI works on this system.
6. Created .gitignore file to ignore virtual environment file.

---

## Day 2: Database Schema & Connection Setup (7/21/2026)

---

1. Created [schema.sql] with tables `patients`,`prescriptions`,`medications`,`blood_reports`,and `biomarkers`.
2. Created the `smartlab` database and ran the DDL script successfully using DBeaver.
3. Added more required packages in [requirements.txt] and installed them.
4. Set up a [.env] to store PostgreSQL connection URL securely.
5. Connected to the database using [database.py].
6. Created [models.py].This file defines your database tables as Python classes
7. Tested the database connection and it connected successfully.

---

## Day 3: Third-Party API Configuration & Code Refactoring (7/22/2026)

---

1. Got `OPENAI_API_KEY` and `GOOGLE_API_KEY` keys from official sites and added them to the .env file.
2. Refactored [database.py] to read connections from the central configuration.
3. Created [app/config.py] to load settings and credentials in a centralized settings class.
4. Tested that the database still works after the refactoring.

---

## Day 4: API Endpoints for File Uploads (7/23/2026)

---

1. Created [prescription.py] endpoint to accept prescription image uploads, then save files locally under `uploads/prescriptions/` and create matching database records in PostgreSQL.
2. Created [blood_reports.py] endpoint to accept PDF/image uploads, save files locally under `uploads/blood_reports/` and create matching database records in PostgreSQL.
3. Created [patient.py] endpoint to handle patient registration and listing.
4. Connected all sub-routers to the main API router in [router.py]
5. The endpoints are not running with the FastAPI

---

## Day 5: Fixed API Endpoints running issues (7/24/2026)

---

1. Refactored [patient.py] so it fetches every patient from the database and returns them as a list.
2. The endpoints are running successfully with th FastAPI.

--- 


