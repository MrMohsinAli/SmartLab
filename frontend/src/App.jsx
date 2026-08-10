import React, { useState, useRef } from 'react';
import { LayoutDashboard, FileText, Activity, Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';
import MobileDrawer from './components/MobileDrawer';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import PrescriptionsPage from './pages/PrescriptionsPage';
import BloodReportsPage from './pages/BloodReportsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const prescriptionInputRef = useRef(null);
  const bloodReportInputRef = useRef(null);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'prescriptions', name: 'Prescriptions', icon: FileText },
    { id: 'blood-reports', name: 'Blood Reports', icon: Activity },
  ];

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
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        uploadedAt: new Date().toLocaleTimeString()
      }));
      setUploadedFiles(prev => [...newFiles, ...prev]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        uploadedAt: new Date().toLocaleTimeString()
      }));
      setUploadedFiles(prev => [...newFiles, ...prev]);
    }
  };

  return (
    <div 
      className="min-h-screen text-gray-900 flex flex-col lg:flex-row font-sans"
      style={{ backgroundImage: 'linear-gradient(to top, #dfe9f3 0%, white 100%)' }}
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
          onClick={() => setActiveTab('dashboard')}
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
          {activeTab === 'dashboard' && (
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
            />
          )}

          {activeTab === 'prescriptions' && (
            <PrescriptionsPage 
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileSelect={handleFileSelect}
              isDragging={isDragging}
            />
          )}

          {activeTab === 'blood-reports' && (
            <BloodReportsPage 
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleFileSelect={handleFileSelect}
              isDragging={isDragging}
            />
          )}
        </div>
      </main>
    </div>
  );
}
