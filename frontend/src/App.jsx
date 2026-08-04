import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Activity, 
  Menu, 
  X, 
  User, 
  ShieldCheck,
  Plus,
  Bell
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const prescriptionInputRef = useRef(null);
  const bloodReportInputRef = useRef(null);

  const patientInfo = {
    name: "mosyy",
    id: "#PT-84920",
    role: "Patient (Uploader)",
    status: "Active"
  };

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'prescriptions', name: 'Prescriptions', icon: FileText },
    { id: 'blood-reports', name: 'Blood Reports', icon: Activity },
  ];

  const mockPrescriptions = [
    { id: 1, drugName: 'Paracetamol', dosage: '500mg', interval: 'Every 8 hours', duration: '7 days', doctor: 'Dr. Saad Shahzad' },
    { id: 2, drugName: 'Ibuprofen', dosage: '400mg', interval: 'Twice daily (after meals)', duration: '5 days', doctor: 'Dr. Umair Dawood' },
    { id: 3, drugName: 'Aspirin', dosage: '20mg', interval: 'Once daily (at bedtime)', duration: '30 days', doctor: 'Dr. Usman Danish' },
  ];

  const mockBiomarkers = [
    { id: 1, name: 'Hemoglobin', value: '14.2 g/dL', range: '12.0 - 17.5 g/dL', status: 'NORMAL', tip: 'Your level is within the standard reference range.' },
    { id: 2, name: 'Fasting Blood Glucose / Blood Sugar', value: '110.0 mg/dL', range: '70.0 - 100.0 mg/dL', status: 'ABNORMAL', tip: 'Your blood sugar level is elevated (prediabetes range). Focus on low-glycemic foods.' },
    { id: 3, name: 'Cholesterol', value: '245.0 mg/dL', range: '0.0 - 200.0 mg/dL', status: 'CRITICAL', tip: 'Your cholesterol level is critically high (>= 240 mg/dL), increasing cardiovascular risk.' },
    { id: 4, name: 'Creatinine', value: '0.9 mg/dL', range: '0.6 - 1.2 mg/dL', status: 'NORMAL', tip: 'Your level is within the standard reference range.' },
    { id: 5, name: 'WBC Count', value: '12.5 x10³/µL', range: '4.0 - 11.0 x10³/µL', status: 'ABNORMAL', tip: 'Your White Blood Cell count is elevated, indicating an active infection response.' },
  ];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col lg:flex-row font-sans">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 p-6 shrink-0 shadow-sm">
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="mb-8 cursor-pointer select-none group"
          title="Go to Home Dashboard"
        >
          <h1 className="text-2xl font-black tracking-tight font-heading flex items-center gap-0.5 group-hover:opacity-90 transition-opacity">
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-950 bg-clip-text text-transparent">Smart</span>
            <span className="text-[#8989ba] font-light">Lab</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#8989ba] inline-block ml-0.5"></span>
          </h1>
          <span className="text-[9px] font-bold text-[#8989ba] uppercase tracking-widest block mt-0.5">Digitalizing HealthCare</span>
        </div>

        <nav className="flex-1 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={isActive ? { backgroundImage: 'linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)' } : {}}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${
                  isActive 
                    ? 'text-white shadow-md shadow-[#8989ba]/30' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-400'} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Patient Profile Footer */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="h-9 w-9 rounded-full bg-[#8989ba]/20 text-[#6a699a] flex items-center justify-center font-bold text-xs shrink-0">
              <User size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-800 truncate">{patientInfo.name}</p>
              <p className="text-[10px] text-gray-400 font-medium truncate">ID: {patientInfo.id}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* --- MOBILE NAVBAR --- */}
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

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="relative w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div 
                onClick={() => {
                  setActiveTab('dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="cursor-pointer select-none"
              >
                <h1 className="text-lg font-black tracking-tight font-heading flex items-center gap-0.5">
                  <span className="text-slate-950">Smart</span>
                  <span className="text-[#8989ba] font-light">Lab</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8989ba] inline-block ml-0.5"></span>
                </h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-1.5">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    style={isActive ? { backgroundImage: 'linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)' } : {}}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${
                      isActive 
                        ? 'text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0">
        
        <header className="hidden lg:flex justify-end items-center gap-3 px-8 py-4 border-b border-gray-200 bg-white relative">
          <button className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors relative" title="Notifications">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#8989ba] ring-2 ring-white"></span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
            >
              <User size={16} className="text-[#8989ba]" />
              <span>Patient</span>
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 space-y-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="h-10 w-10 rounded-full bg-[#8989ba]/15 text-[#6a699a] flex items-center justify-center font-bold text-sm">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{patientInfo.name}</p>
                    <p className="text-xs text-gray-400">ID: {patientInfo.id}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400">Role:</span>
                    <span className="font-semibold text-gray-800">{patientInfo.role}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-50">
                    <span className="text-gray-400">Uploaded Files:</span>
                    <span className="font-semibold text-gray-800">{uploadedFiles.length} file(s)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Status:</span>
                    <span className="font-semibold text-emerald-600">{patientInfo.status}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 p-6 lg:p-8 space-y-8 overflow-y-auto">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Gradient Hero Banner */}
              <div 
                className="relative overflow-hidden rounded-2xl p-8 text-white shadow-lg border border-white/20"
                style={{ backgroundImage: 'linear-gradient(to top, #6a85b6 0%, #bac8e0 100%)' }}
              >
                <div className="relative z-10 space-y-4 max-w-2xl">
                  <h2 className="text-3xl font-extrabold text-white font-heading leading-tight drop-shadow-sm">
                    AI-Powered Healthcare Digitization
                  </h2>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium max-w-xl">
                    SmartLab automatically converts your handwritten prescriptions and multi-column lab blood reports into digital summaries, flagging critical health alerts instantly.
                  </p>
                </div>
              </div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1 */}
                <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-gray-500">Total Uploads</span>
                    <span 
                      className="p-2.5 rounded-xl text-white shadow-xs"
                      style={{ backgroundImage: 'linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)' }}
                    >
                      <FileText size={20} />
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 font-heading">12</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Prescriptions and blood reports analyzed</p>
                </div>

                {/* Card 2 */}
                <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-gray-500">Active Prescriptions</span>
                    <span className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck size={20} /></span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 font-heading">3</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Parsed dosage intervals monitored</p>
                </div>

                {/* Card 3 */}
                <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-gray-500">Biomarkers Tracked</span>
                    <span className="p-2.5 rounded-xl bg-purple-50 text-purple-600"><Activity size={20} /></span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900 font-heading">18</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Lab report values evaluated</p>
                </div>

              </div>

              {/* Processing Queue List */}
              {uploadedFiles.length > 0 && (
                <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-gray-900">Processing Documents Queue</h4>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#8989ba]/15 text-[#6a699a]">
                      {uploadedFiles.length} file(s)
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="py-3 flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg text-white"
                            style={{ backgroundImage: 'linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)' }}
                          >
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-400">{file.size} • Uploaded at {file.uploadedAt}</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                          Processing OCR
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Medical Summaries Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Prescriptions Preview */}
                <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Recent Prescriptions</h4>
                      <p className="text-xs text-gray-500">Extracted dosage routines</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('prescriptions')}
                      className="text-xs font-semibold text-[#8989ba] hover:text-[#6a699a] underline"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {mockPrescriptions.slice(0, 2).map((med) => (
                      <div key={med.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{med.drugName} <span className="text-xs font-normal text-gray-500">({med.dosage})</span></p>
                          <p className="text-gray-500 mt-0.5">{med.interval}</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-white text-gray-700 border border-gray-200 font-medium text-xs shadow-2xs">
                          {med.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Biomarker Alert Overview */}
                <div className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">Biomarker Health Summary</h4>
                      <p className="text-xs text-gray-500">Evaluated clinical reference ranges</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab('blood-reports')}
                      className="text-xs font-semibold text-[#8989ba] hover:text-[#6a699a] underline"
                    >
                      View All →
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    {mockBiomarkers.slice(0, 2).map((bio) => (
                      <div key={bio.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{bio.name}</p>
                          <p className="text-gray-500 mt-0.5">{bio.value} (Ref: {bio.range})</p>
                        </div>
                        <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                          bio.status === 'NORMAL' 
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                            : bio.status === 'ABNORMAL' 
                            ? 'bg-amber-100 text-amber-800 border-amber-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {bio.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Digitized Prescriptions</h2>
                  <p className="text-xs text-gray-500">View your handwritten prescription dosage routines</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Drug Name</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dosage</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Interval</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Prescribed By</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockPrescriptions.map((presc) => (
                      <tr key={presc.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{presc.drugName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{presc.dosage}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{presc.interval}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{presc.duration}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{presc.doctor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'blood-reports' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 font-heading">Blood Biomarkers</h2>
                  <p className="text-xs text-gray-500">Analyze reference ranges and view clinical alert tags</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBiomarkers.map((bio) => {
                  const statusColors = {
                    NORMAL: {
                      border: 'border-emerald-200 bg-emerald-50/20',
                      badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
                    },
                    ABNORMAL: {
                      border: 'border-amber-200 bg-amber-50/20',
                      badge: 'bg-amber-100 text-amber-800 border border-amber-200',
                    },
                    CRITICAL: {
                      border: 'border-red-200 bg-red-50/20',
                      badge: 'bg-red-100 text-red-800 border border-red-200',
                    }
                  }[bio.status];

                  return (
                    <div key={bio.id} className={`border rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between ${statusColors.border}`}>
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 text-sm leading-snug">{bio.name}</h3>
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider ${statusColors.badge}`}>
                            {bio.status}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900 font-heading">{bio.value}</span>
                          <span className="text-xs text-gray-400">Ref: {bio.range}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <strong className="text-gray-800">Clinical Tip:</strong> {bio.tip}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
