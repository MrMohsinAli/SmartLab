import React, { useState, useEffect, useRef } from "react";
import { LayoutDashboard, FileText, Activity, Menu, X, AlertTriangle, UserPlus, Check, Bookmark, XCircle, KeyRound } from "lucide-react";
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
  const [totalPrescDocs, setTotalPrescDocs] = useState(0);
  const [totalReportDocs, setTotalReportDocs] = useState(0);
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

  // Persistent localStorage helper to track resolved mismatches across page reloads
  const getResolvedMismatches = () => {
    try {
      const saved = localStorage.getItem("smartlab_resolved_mismatches");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const markMismatchAsResolved = (mismatchKey) => {
    if (!mismatchKey) return;
    try {
      const current = getResolvedMismatches();
      if (!current.includes(mismatchKey)) {
        const updated = [...current, mismatchKey];
        localStorage.setItem("smartlab_resolved_mismatches", JSON.stringify(updated));
      }
    } catch (e) {
      console.warn("Could not save resolved mismatch:", e);
    }
  };

  // Fetch patients list
  const refreshPatients = async () => {
    try {
      const patientList = await fetchPatients();
      if (Array.isArray(patientList) && patientList.length > 0) {
        setPatients(patientList);
        if (!activePatient) {
          setActivePatient(patientList[0]);
        }
      }
    } catch (err) {
      console.warn("Could not fetch patients from backend:", err);
    }
  };

  // Fetch real data for current active patient (or all data if in Admin Console mode) from FastAPI backend
  const refreshBackendData = async (currentPatient = activePatient) => {
    try {
      const isAdminMode = currentPatient && currentPatient.id === 'ADMIN_ALL';
      const patientId = isAdminMode ? null : (currentPatient ? currentPatient.id : null);
      
      const [prescriptionsRes, reportsRes] = await Promise.allSettled([
        fetchPrescriptions(patientId),
        fetchBloodReports(patientId),
      ]);

      const resolvedList = getResolvedMismatches();
      let allPrescs = [];
      let allReports = [];

      if (prescriptionsRes.status === "fulfilled" && Array.isArray(prescriptionsRes.value)) {
        allPrescs = prescriptionsRes.value;
        setTotalPrescDocs(allPrescs.length);
        const extractedMeds = [];
        allPrescs.forEach((p) => {
          if (!isAdminMode && p.detected_patient_name && currentPatient) {
            const activeFullName = `${currentPatient.first_name} ${currentPatient.last_name}`.toLowerCase();
            const isMismatch = !activeFullName.includes(p.detected_patient_name.toLowerCase()) && !p.detected_patient_name.toLowerCase().includes(currentPatient.first_name.toLowerCase());
            const key = `presc_${p.id}_${p.detected_patient_name}`;
            
            if (isMismatch && !resolvedList.includes(key)) {
              setNameMismatchNotice({
                mismatchKey: key,
                detectedName: p.detected_patient_name,
                fileName: p.file_name,
                documentId: p.id,
                type: "prescription"
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
      } else {
        setTotalPrescDocs(0);
        setBackendPrescriptions([]);
      }

      if (reportsRes.status === "fulfilled" && Array.isArray(reportsRes.value)) {
        allReports = reportsRes.value;
        setTotalReportDocs(allReports.length);
        const extractedBiomarkers = [];
        allReports.forEach((r) => {
          if (!isAdminMode && r.detected_patient_name && currentPatient) {
            const activeFullName = `${currentPatient.first_name} ${currentPatient.last_name}`.toLowerCase();
            const isMismatch = !activeFullName.includes(r.detected_patient_name.toLowerCase()) && !r.detected_patient_name.toLowerCase().includes(currentPatient.first_name.toLowerCase());
            const key = `report_${r.id}_${r.detected_patient_name}`;

            if (isMismatch && !resolvedList.includes(key)) {
              setNameMismatchNotice({
                mismatchKey: key,
                detectedName: r.detected_patient_name,
                fileName: r.file_name,
                documentId: r.id,
                type: "blood-report"
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
      } else {
        setTotalReportDocs(0);
        setBackendBiomarkers([]);
      }

      // Sync upload queue status based on actual backend DB processing status
      setUploadedFiles((prevQueue) =>
        prevQueue.map((item) => {
          if (item.status === "Completed" || item.status === "Failed") return item;
          
          const matchedP = allPrescs.find((p) => p.id === item.docId || p.file_name === item.name);
          const matchedR = allReports.find((r) => r.id === item.docId || r.file_name === item.name);
          const matched = matchedP || matchedR;

          if (matched) {
            if (matched.status === "COMPLETED") {
              return { ...item, status: "Completed" };
            }
            if (matched.status === "FAILED") {
              return { ...item, status: "Failed" };
            }
          }
          return item;
        })
      );
    } catch (err) {
      console.warn("FastAPI Backend unreachable:", err);
    }
  };

  useEffect(() => {
    refreshPatients();
  }, []);

  useEffect(() => {
    if (activePatient) {
      refreshBackendData(activePatient);
    }
  }, [activePatient]);

  // Poll backend while any document in the upload queue is still processing
  useEffect(() => {
    const hasPending = uploadedFiles.some((f) => f.status === "Processing OCR" || f.status === "Uploading");
    if (!hasPending) return;

    const timer = setInterval(() => {
      refreshBackendData(activePatient);
    }, 2000);

    return () => clearInterval(timer);
  }, [uploadedFiles, activePatient]);

  const handleCreatePatient = async (patientData) => {
    const newPatient = await createPatient(patientData);
    await refreshPatients();
    setActivePatient(newPatient);
    return newPatient;
  };

  // Action 1: Create new profile for detected OCR patient
  const handleCreateNewProfileForDetected = async () => {
    if (!nameMismatchNotice || !nameMismatchNotice.detectedName) return;
    if (nameMismatchNotice.mismatchKey) {
      markMismatchAsResolved(nameMismatchNotice.mismatchKey);
    }

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

  // Action 2: Keep document in current logged-in patient profile
  const handleKeepInCurrentProfile = () => {
    if (nameMismatchNotice?.mismatchKey) {
      markMismatchAsResolved(nameMismatchNotice.mismatchKey);
    }
    setNameMismatchNotice(null);
  };

  // Action 3: Completely dismiss announcement
  const handleDismissNotice = () => {
    if (nameMismatchNotice?.mismatchKey) {
      markMismatchAsResolved(nameMismatchNotice.mismatchKey);
    }
    setNameMismatchNotice(null);
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
      status: "Processing OCR",
      docId: null
    }));

    setUploadedFiles((prev) => [...newQueueItems, ...prev]);

    const targetPatientId = (activePatient && activePatient.id !== 'ADMIN_ALL') ? activePatient.id : null;

    for (const file of fileArray) {
      const ext = file.name.split('.').pop().toLowerCase();
      try {
        let res;
        if (targetType === "prescription" || (ext !== "pdf" && activeTab === "prescriptions")) {
          res = await uploadPrescription(file, targetPatientId);
        } else if (targetType === "blood-report" || ext === "pdf" || activeTab === "blood-reports") {
          res = await uploadBloodReport(file, targetPatientId);
        } else {
          if (ext === "pdf") {
            res = await uploadBloodReport(file, targetPatientId);
          } else {
            res = await uploadPrescription(file, targetPatientId);
          }
        }

        // Attach returned docId and initial status
        if (res && res.id) {
          setUploadedFiles((prev) =>
            prev.map((item) =>
              item.name === file.name 
                ? { 
                    ...item, 
                    docId: res.id, 
                    status: res.status === "COMPLETED" ? "Completed" : "Processing OCR" 
                  } 
                : item
            )
          );
        }

        if (res && res.detected_patient_name && activePatient && activePatient.id !== 'ADMIN_ALL') {
          const activeFullName = `${activePatient.first_name} ${activePatient.last_name}`.toLowerCase();
          const isMismatch = !activeFullName.includes(res.detected_patient_name.toLowerCase()) && !res.detected_patient_name.toLowerCase().includes(activePatient.first_name.toLowerCase());
          const key = `doc_${res.id}_${res.detected_patient_name}`;
          
          if (isMismatch && !getResolvedMismatches().includes(key)) {
            setNameMismatchNotice({
              mismatchKey: key,
              detectedName: res.detected_patient_name,
              fileName: file.name,
              documentId: res.id
            });
          }
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        setUploadError(`Upload failed for ${file.name}: ${err.message}`);
        setUploadedFiles((prev) =>
          prev.map((item) =>
            item.name === file.name ? { ...item, status: "Failed" } : item
          )
        );
      }
    }

    setIsUploading(false);
    refreshBackendData(activePatient);
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

  const displayTotalDocsCount = uploadedFiles.length + totalPrescDocs + totalReportDocs;

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
        activePatient={activePatient}
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
            uploadedFilesCount={displayTotalDocsCount}
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
        activePatient={activePatient}
      />

      {/* Main App Layout */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          uploadedFilesCount={displayTotalDocsCount}
          activePatient={activePatient}
          patients={patients}
          onSelectPatient={(p) => setActivePatient(p)}
          onCreatePatient={handleCreatePatient}
        />

        <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          {/* Compact Light Reddish Gradient OCR Patient Mismatch Announcement Banner */}
          {nameMismatchNotice && activePatient?.id !== 'ADMIN_ALL' && (
            <div 
              className="py-2.5 px-4 rounded-xl text-white shadow-md border border-white/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 transition-all duration-300"
              style={{ backgroundImage: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #e11d48 100%)' }}
            >
              <div className="flex items-center gap-2.5 max-w-xl">
                <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white shrink-0 shadow-sm border border-white/30">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-white text-xs font-heading tracking-wide">
                      OCR Mismatch: "{nameMismatchNotice.detectedName}"
                    </h4>
                    <p className="text-rose-100 text-[11px] leading-tight">
                      Document <span className="font-bold text-white underline">{nameMismatchNotice.fileName}</span> specifies <strong>"{nameMismatchNotice.detectedName}"</strong>, but active is <strong>"{activePatient?.first_name} {activePatient?.last_name}"</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Compact Action Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end lg:self-auto">
                <button
                  onClick={handleCreateNewProfileForDetected}
                  className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-900 font-bold rounded-lg text-[11px] flex items-center gap-1 shadow-sm transition-all duration-200 cursor-pointer"
                  title={`Create and switch to new profile for ${nameMismatchNotice.detectedName}`}
                >
                  <UserPlus size={12} className="text-rose-600" /> Create Profile for "{nameMismatchNotice.detectedName}"
                </button>

                <button
                  onClick={handleKeepInCurrentProfile}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg text-[11px] flex items-center gap-1 border border-white/30 backdrop-blur-md transition-all duration-200 cursor-pointer"
                  title={`Assign document to ${activePatient?.first_name} ${activePatient?.last_name}`}
                >
                  <Bookmark size={12} /> Keep in {activePatient?.first_name}
                </button>

                <button
                  onClick={handleDismissNotice}
                  className="px-2 py-1 text-rose-100 hover:text-white font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  title="Dismiss notification"
                >
                  <XCircle size={13} /> Dismiss
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
