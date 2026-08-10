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
