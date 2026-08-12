import React, { useState, useEffect, useRef } from "react";
import { LayoutDashboard, FileText, Activity, Menu, X } from "lucide-react";
import Sidebar from "./components/Sidebar";
import MobileDrawer from "./components/MobileDrawer";
import Header from "./components/Header";
import DashboardPage from "./pages/DashboardPage";
import PrescriptionsPage from "./pages/PrescriptionsPage";
import BloodReportsPage from "./pages/BloodReportsPage";
import {
  uploadPrescription,
  uploadBloodReport,
  fetchPrescriptions,
  fetchBloodReports,
} from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [backendPrescriptions, setBackendPrescriptions] = useState([]);
  const [backendBiomarkers, setBackendBiomarkers] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const prescriptionInputRef = useRef(null);
  const bloodReportInputRef = useRef(null);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
    { id: "prescriptions", name: "Prescriptions", icon: FileText },
    { id: "blood-reports", name: "Blood Reports", icon: Activity },
  ];

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
    refreshBackendData();
  }, []);

  const handleFileUpload = async (files, targetType = null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadError(null);

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
        if (targetType === "prescription" || (ext !== "pdf" && activeTab === "prescriptions")) {
          await uploadPrescription(file);
        } else if (targetType === "blood-report" || ext === "pdf" || activeTab === "blood-reports") {
          await uploadBloodReport(file);
        } else {
          if (ext === "pdf") {
            await uploadBloodReport(file);
          } else {
            await uploadPrescription(file);
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
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div
          onClick={() => setActiveTab("dashboard")}
          className="cursor-pointer select-none"
        >
          <h1 className="text-lg font-black tracking-tight font-heading flex items-center gap-0.5">
            <span className="text-slate-950">Smart</span>
            <span className="text-[#8989ba] font-light">Lab</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#8989ba] inline-block ml-0.5"></span>
          </h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 text-gray-600 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        menuItems={menuItems}
      />

      {/* Main App Layout */}
      <main className="flex-1 flex flex-col min-w-0">
        <Header uploadedFilesCount={uploadedFiles.length} />

        <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
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
