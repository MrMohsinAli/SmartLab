# SmartLab

---

## MODULE 4

---

## Day 1: Clinical Biomarker Markers (8/10/2026)

---

1. Implemented visual status markers for clinical biomarker evaluation.
2. Created Green status badges and markers (`NORMAL`) for healthy blood parameters.
3. Created Yellow/Amber status badges and markers (`ABNORMAL`) for out-of-range clinical values.
4. Created dynamic pulsing Red card borders, glowing danger badges, and animated ping markers (`CRITICAL`) for critical danger alerts.

```text
frontend/
├── package.json          # Core package scripts and dev dependencies configuration
├── tailwind.config.js    # Tailwind CSS layout scanning paths
├── postcss.config.js     # PostCSS CSS compiling rules
├── vite.config.js        # Vite dev server and hot-reload setup
├── index.html            # Entry point for the browser
└── src/
    ├── main.jsx          # Entry script connecting HTML container to React App
    ├── App.jsx           # Core dashboard structure and modular page routing
    ├── index.css         # Base Tailwind CSS rules and custom scrollbars 
    ├── components/
    │   ├── DailyHealthTip.jsx        
    │   ├── NotificationsDropdown.jsx 
    │   ├── PatientDropdown.jsx       
    │   ├── Header.jsx                
    │   ├── Sidebar.jsx               
    │   ├── MobileDrawer.jsx   
    │   └── biomarkerStyles.jsx        
    ├── pages/
    │   ├── DashboardPage.jsx         
    │   ├── PrescriptionsPage.jsx     
    │   └── BloodReportsPage.jsx    
    ├── data/
    │   └── mockData.js   
```

---

## Day 2: FastAPI Backend API & CORS Integration (8/11/2026)

---

1. Enabled `CORSMiddleware` in `backend/app/main.py` allowing frontend cross-origin requests.
2. Modified endpoint files to add new endpoints to retrieve uploaded prescriptions, lab reports and parsed medication lists, evaluated biomarker reference values.

---

## Day 3: Full API Integration & Pure Backend State (8/12/2026)

---

1. Created `api.js` to manage all frontend communication with FastAPI endpoints.
2. Connected React dropzones, prescription tables, and blood report grid views directly to live FastAPI services.
3. Removed hardcoded mockData arrays, but the daily health tips are still hardcoded.

---

## Day 4: Patient Profile Registration (8/13/2026)

---

1. Added Patient Profile Registration & Switcher dropdown.
2. Modified patient header names (`detected_patient_name`) to show extracted patient name during backend OCR background tasks in `tasks.py`.
3. Fixed issues with Mobile design. The dropdowns and header were going out of the page.

---

## Day 5: Dynamic Profile Filtering & Admin Console (8/14/2026)

---

1. Updated React state in `App.jsx` and `api.js` to only show prescriptions and evaluated biomarkers of the selected patient profile.
2. Built OCR Patient Mismatch Verification Announcement Banner with 3 interactive action choices (Create New Profile, Keep in Current Profile, Dismiss) with local storage resolution persistence.
3. Created Password-Locked **Admin Console** mode in the patient dropdown menu.
4. Synchronized real-time queue item statuses (`Uploading` -> `Processing OCR` -> `Completed`) with live PostgreSQL OCR task execution states.

---