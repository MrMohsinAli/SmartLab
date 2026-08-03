import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Activity, 
  Menu, 
  X, 
  User, 
  TrendingUp,
  ShieldCheck,
  Plus
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'prescriptions', name: 'Prescriptions', icon: FileText },
    { id: 'blood-reports', name: 'Blood Reports', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col lg:flex-row font-sans">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 p-6 shrink-0">
        {/* Brand/Logo */}
        <div className="mb-8">
          <h1 className="text-lg font-bold text-gray-950 leading-tight">SmartLab</h1>
          <span className="text-xs text-cyan-600 font-medium">Digitalizing HealthCare</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors ${
                  isActive 
                    ? 'bg-cyan-600 text-white font-medium' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-white' : 'text-gray-550'} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

      </aside>

      {/* --- MOBILE NAVBAR --- */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-40">
        <div>
          <h1 className="text-base font-bold text-gray-950">SmartLab</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1 text-gray-550 hover:text-gray-900"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsMobileMenuOpen(false)} />
          
          <div className="relative w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-base font-bold text-gray-950">SmartLab</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-550 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <nav className="space-y-1">
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
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded transition-colors ${
                      isActive 
                        ? 'bg-cyan-600 text-white font-medium' 
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
        
        <header className="hidden lg:flex justify-end px-8 py-4 border-b border-gray-200 bg-white">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50 font-medium">
            <User size={16} />
            <span>Account</span>
          </button>
        </header>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Analytics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1 */}
                <div className="border border-gray-200 rounded-xl p-6 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-gray-550">Total Uploads</span>
                    <span className="p-2 rounded bg-cyan-50 text-cyan-600"><FileText size={18} /></span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">12</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Prescriptions and blood reports analyzed</p>
                </div>

                {/* Card 2 */}
                <div className="border border-gray-200 rounded-xl p-6 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-gray-500">Active Prescriptions</span>
                    <span className="p-2 rounded bg-emerald-50 text-emerald-600"><ShieldCheck size={18} /></span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">3</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Parsed dosage intervals monitored</p>
                </div>

                {/* Card 3 */}
                <div className="border border-gray-200 rounded-xl p-6 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-medium text-gray-500">Biomarkers Tracked</span>
                    <span className="p-2 rounded bg-purple-50 text-purple-600"><Activity size={18} /></span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">18</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Lab report values evaluated</p>
                </div>

              </div>

              {/* Welcome Banner */}
              <div className="border border-gray-200 rounded-xl p-6 bg-white flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 space-y-3 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-gray-900 font-heading">
                    AI-Powered Healthcare Digitization
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                    SmartLab automatically converts your handwritten prescriptions and multi-column lab blood reports into digital summaries, flagging critical health alerts automatically.
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                    <button onClick={() => setActiveTab('prescriptions')} className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-sm flex items-center gap-2 transition-colors">
                      <Plus size={16} /> Upload Prescription
                    </button>
                    <button onClick={() => setActiveTab('blood-reports')} className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white font-medium text-sm transition-colors">
                      Upload Blood Report
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-heading">Digitized Prescriptions</h2>
                <p className="text-xs text-gray-500">View and upload your handwritten prescription notes</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-12 text-center bg-white">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-base font-semibold mb-1 text-gray-800">Prescription Records</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  No prescriptions uploaded yet. Extracted medication profiles, dosages, and durations will be listed in this section.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'blood-reports' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-heading">Blood Biomarkers</h2>
                <p className="text-xs text-gray-500">Analyze reference ranges and view clinical alert tags</p>
              </div>
              <div className="border border-gray-200 rounded-xl p-12 text-center bg-white">
                <Activity size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-base font-semibold mb-1 text-gray-900">Biomarker Metrics</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  No blood reports uploaded yet. Evaluated biomarkers, clinical reference ranges, and alerts will be listed in this section.
                </p>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
