import React, { useState, useEffect, useRef } from "react";
import { LayoutDashboard, FileText, Activity, Menu, X, AlertTriangle, UserPlus, Check } from "lucide-react";
import Sidebar from "./components/Sidebar";
import MobileDrawer from "./components/MobileDrawer";
import Header from "./components/Header";
import NotificationsDropdown from "./components/NotificationsDropdown";
import PatientDropdown from "./components/PatientDropdown";
import DashboardPage from "./pages/DashboardPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import BloodReportsPage from "./pages/BloodReportsPage";
import {
  uploadPrescription,
  uploadBloodReport,
  fetchPrescriptions,
  fetchBloodReports,
  fetchPatients,
  createPatient,
} from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileNotificationsOpen, setIsMobileNotificationsOpen] = useState(false);
  const [isMobilePatientOpen, setIsMobilePatientOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [backendPrescriptions, setBackendPrescriptions] = useState([]);
  const [backendBiomarkers, setBackendBiomarkers] = useState([]);
  const [patients, setPatients] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [nameMismatchNotice, setNameMismatchNotice] = useState(null);

  const prescriptionInputRef = useRef(null);
  const bloodReportInputRef = useRef(null);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "prescriptions", name: "Prescriptions", icon: FileText },
    { id: "blood-reports", name: "Blood Reports", icon: Activity },
  ];

  // Fetch patients list
  const refreshPatients = async () => {
    try {
      const patientList = await fetchPatients();
      if (Array.isArray(patientList)) {
        setPatients(patientList);
        if (!activePatient && patientList.length > 0) {
          setActivePatient(patientList[0]);
        }
      }
    } catch (err) {
      console.warn("Could not fetch patients from backend:", err);
    }
  };

  // Fetch real data from FastAPI backend
  const refreshBackendData = async () => {
    try {
      const [prescriptionsRes, reportsRes] = await Promise.allSettled([
        fetchPrescriptions(),
        fetchBloodReports(),
      ]);

      if (prescriptionsRes.status === "fulfilled" && Array.isArray(prescriptionsRes.value)) {
        const extractedMeds = [];
        prescriptionsRes.value.forEach((p) => {
          if (p.detected_patient_name && activePatient) {
            const activeFullName = `${activePatient.first_name} ${activePatient.last_name}`.toLowerCase();
            if (!activeFullName.includes(p.detected_patient_name.toLowerCase()) && !p.detected_patient_name.toLowerCase().includes(activePatient.first_name.toLowerCase())) {
              setNameMismatchNotice({
                detectedName: p.detected_patient_name,
                fileName: p.file_name
              });
            }
          }

          if (p.medications && p.medications.length > 0) {
            p.medications.forEach((m) => {
              extractedMeds.push({
                id: m.id || p.id,
                drugName: m.drug_name,
                dosage: m.dosage || "Standard Dose",
                interval: m.interval || "As Directed",
                duration: m.duration || "7 Days",
              });
            });
          }
        });
        setBackendPrescriptions(extractedMeds);
      }

      if (reportsRes.status === "fulfilled" && Array.isArray(reportsRes.value)) {
        const extractedBiomarkers = [];
        reportsRes.value.forEach((r) => {
          if (r.detected_patient_name && activePatient) {
            const activeFullName = `${activePatient.first_name} ${activePatient.last_name}`.toLowerCase();
            if (!activeFullName.includes(r.detected_patient_name.toLowerCase()) && !r.detected_patient_name.toLowerCase().includes(activePatient.first_name.toLowerCase())) {
              setNameMismatchNotice({
                detectedName: r.detected_patient_name,
                fileName: r.file_name
              });
            }
          }

          if (r.biomarkers && r.biomarkers.length > 0) {
            r.biomarkers.forEach((b) => {
              extractedBiomarkers.push({
                id: b.id,
                name: b.name,
                value: `${b.value} ${b.unit || ""}`.trim(),
                range: b.reference_range || `${b.reference_range_min || 0} - ${b.reference_range_max || 100}`,
                status: b.status || "NORMAL",
                tip: b.educational_tip || "Clinical reference value evaluated by SmartLab rules engine.",
              });
            });
          }
        });
        setBackendBiomarkers(extractedBiomarkers);
      }
    } catch (err) {
      console.warn("FastAPI Backend unreachable:", err);
    }
  };

  useEffect(() => {
    refreshPatients();
    refreshBackendData();
  }, []);

  const handleCreatePatient = async (patientData) => {
    const newPatient = await createPatient(patientData);
    await refreshPatients();
    setActivePatient(newPatient);
    return newPatient;
  };

  const handleQuickRegisterDetectedPatient = async () => {
    if (!nameMismatchNotice || !nameMismatchNotice.detectedName) return;
    const parts = nameMismatchNotice.detectedName.trim().split(" ");
    const firstName = parts[0] || "Patient";
    const lastName = parts.slice(1).join(" ") || "Profile";
    
    try {
      await handleCreatePatient({
        first_name: firstName,
        last_name: lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@smartlab.io`
      });
      setNameMismatchNotice(null);
    } catch (err) {
      console.error("Failed to auto-register detected patient:", err);
    }
  };

  const handleFileUpload = async (files, targetType = null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);
    setNameMismatchNotice(null);

    const fileArray = Array.from(files);
    const newQueueItems = fileArray.map((f) => ({
      name: f.name,
      size: (f.size / 1024).toFixed(1) + " KB",
      uploadedAt: new Date().toLocaleTimeString(),
      status: "Uploading",
    }));

    setUploadedFiles((prev) => [...newQueueItems, ...prev]);

    for (const file of fileArray) {
      const ext = file.name.split('.').pop().toLowerCase();
      try {
        let res;
        if (targetType === "prescription" || (ext !== "pdf" && activeTab === "prescriptions")) {
          res = await uploadPrescription(file, activePatient?.id);
        } else if (targetType === "blood-report" || ext === "pdf" || activeTab === "blood-reports") {
          res = await uploadBloodReport(file, activePatient?.id);
        } else {
          if (ext === "pdf") {
            res = await uploadBloodReport(file, activePatient?.id);
          } else {
            res = await uploadPrescription(file, activePatient?.id);
          }
        }

        if (res && res.detected_patient_name && activePatient) {
          const activeFullName = `${activePatient.first_name} ${activePatient.last_name}`.toLowerCase();
          if (!activeFullName.includes(res.detected_patient_name.toLowerCase()) && !res.detected_patient_name.toLowerCase().includes(activePatient.first_name.toLowerCase())) {
            setNameMismatchNotice({
              detectedName: res.detected_patient_name,
              fileName: file.name
            });
          }
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        setUploadError(`Upload failed for ${file.name}: ${err.message}`);
      }
    }

    setIsUploading(false);
    setTimeout(() => {
      refreshBackendData();
    }, 1500);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e, targetType = null) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files, targetType);
    }
  };

  return (
    <div
      className="min-h-screen text-gray-900 flex flex-col lg:flex-row font-sans"
      style={{
        backgroundImage: "linear-gradient(to top, #dfe9f3 0%, white 100%)",
      }}
    >
      {/* Desktop Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={menuItems}
      />

      {/* Mobile Top Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-gray-600 hover:text-gray-900"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div
            onClick={() => setActiveTab("dashboard")}
            className="cursor-pointer select-none"
          >
            <h1 className="text-base font-black tracking-tight font-heading flex items-center gap-0.5">
              <span className="text-slate-950">Smart</span>
              <span className="text-[#8989ba] font-light">Lab</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#8989ba] inline-block ml-0.5"></span>
            </h1>
          </div>
        </div>

        {/* Mobile Header Dropdowns */}
        <div className="flex items-center gap-1.5">
          <NotificationsDropdown
            isOpen={isMobileNotificationsOpen}
            onToggle={() => {
              setIsMobileNotificationsOpen(!isMobileNotificationsOpen);
              if (!isMobileNotificationsOpen) setIsMobilePatientOpen(false);
            }}
          />
          <PatientDropdown
            isOpen={isMobilePatientOpen}
            onToggle={() => {
              setIsMobilePatientOpen(!isMobilePatientOpen);
              if (!isMobilePatientOpen) setIsMobileNotificationsOpen(false);
            }}
            uploadedFilesCount={uploadedFiles.length}
            activePatient={activePatient}
            patients={patients}
            onSelectPatient={(p) => setActivePatient(p)}
            onCreatePatient={handleCreatePatient}
          />
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={menuItems}
        uploadedFilesCount={uploadedFiles.length}
        activePatient={activePatient}
        patients={patients}
        onSelectPatient={(p) => setActivePatient(p)}
        onCreatePatient={handleCreatePatient}
      />

      {/* Main App Layout */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          uploadedFilesCount={uploadedFiles.length}
          activePatient={activePatient}
          patients={patients}
          onSelectPatient={(p) => setActivePatient(p)}
          onCreatePatient={handleCreatePatient}
        />

        <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* OCR Patient Name Mismatch Warning Banner */}
          {nameMismatchNotice && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 shadow-md text-xs text-amber-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-200/60 text-amber-800 shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="font-bold text-amber-950 text-sm">
                    OCR Patient Mismatch Detected: "{nameMismatchNotice.detectedName}"
                  </p>
                  <p className="text-amber-800 text-xs mt-0.5">
                    Document <span className="font-bold">{nameMismatchNotice.fileName}</span> specifies patient name <strong>"{nameMismatchNotice.detectedName}"</strong>, but active profile is <strong>"{activePatient?.first_name} {activePatient?.last_name}"</strong>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  onClick={handleQuickRegisterDetectedPatient}
                  className="px-3.5 py-1.5 bg-amber-900 hover:bg-amber-950 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <UserPlus size={14} /> Create/Switch to "{nameMismatchNotice.detectedName}"
                </button>
                <button
                  onClick={() => setNameMismatchNotice(null)}
                  className="px-2.5 py-1.5 text-amber-800 hover:text-amber-950 font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {uploadError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex justify-between items-center">
              <span>{uploadError}</span>
              <button onClick={() => setUploadError(null)} className="font-bold underline ml-2">Dismiss</button>
            </div>
          )}

          {activeTab === "dashboard" && (
            <DashboardPage
              prescriptionInputRef={prescriptionInputRef}
              bloodReportInputRef={bloodReportInputRef}
              handleFileSelect={handleFileSelect}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              isDragging={isDragging}
              uploadedFiles={uploadedFiles}
              setActiveTab={setActiveTab}
              prescriptions={backendPrescriptions}
              biomarkers={backendBiomarkers}
              isUploading={isUploading}
            />
          )}

          {activeTab === "prescriptions" && (
            <PrescriptionsPage
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileSelect={(e) => handleFileSelect(e, "prescription")}
              isDragging={isDragging}
              prescriptions={backendPrescriptions}
              isUploading={isUploading}
            />
          )}

          {activeTab === "blood-reports" && (
            <BloodReportsPage
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileSelect={(e) => handleFileSelect(e, "blood-report")}
              isDragging={isDragging}
              biomarkers={backendBiomarkers}
              isUploading={isUploading}
            />
          )}
        </div>
      </main>
    </div>
  );
}
