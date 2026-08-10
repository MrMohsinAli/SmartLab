import React from 'react';
import { Plus, FileText, Activity, ShieldCheck } from 'lucide-react';
import { mockPrescriptions, mockBiomarkers } from '../data/mockData';
import { getBiomarkerStatusStyle } from '../utils/biomarkerStyles';

export default function DashboardPage({ 
  prescriptionInputRef, 
  bloodReportInputRef, 
  handleFileSelect, 
  handleDragOver, 
  handleDragLeave, 
  handleDrop, 
  isDragging, 
  uploadedFiles,
  setActiveTab 
}) {
  return (
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
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <input 
              type="file" 
              ref={prescriptionInputRef} 
              onChange={handleFileSelect} 
              accept=".jpg,.jpeg,.png,image/jpeg,image/png,image/jpg" 
              className="hidden" 
            />
            <input 
              type="file" 
              ref={bloodReportInputRef} 
              onChange={handleFileSelect} 
              accept="image/*,.pdf" 
              className="hidden" 
            />
            <button
              onClick={() => prescriptionInputRef.current?.click()}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus size={16} /> Upload Prescription
            </button>
            <button
              onClick={() => bloodReportInputRef.current?.click()}
              style={{ backgroundImage: 'linear-gradient(to top, #dfe9f3 0%, white 100%)' }}
              className="px-5 py-2.5 rounded-xl text-slate-800 font-semibold text-sm flex items-center gap-2 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 hover:opacity-90"
            >
              <Plus size={16} /> Upload Blood Report
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Uploads */}
        <div className="border border-gray-200/80 rounded-2xl p-6 bg-white shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-600">Total Uploads</span>
            <div 
              className="p-2.5 rounded-xl text-white shadow-xs"
              style={{ backgroundImage: 'linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)' }}
            >
              <FileText size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 font-heading">12</p>
            <p className="text-xs text-gray-400 font-normal mt-1">Prescriptions and blood reports analyzed</p>
          </div>
        </div>

        {/* Card 2: Active Prescriptions */}
        <div className="border border-gray-200/80 rounded-2xl p-6 bg-white shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-600">Active Prescriptions</span>
            <div className="p-2.5 rounded-xl bg-emerald-100/70 text-emerald-600">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 font-heading">{mockPrescriptions.length}</p>
            <p className="text-xs text-gray-400 font-normal mt-1">Parsed dosage intervals monitored</p>
          </div>
        </div>

        {/* Card 3: Biomarkers Tracked */}
        <div className="border border-gray-200/80 rounded-2xl p-6 bg-white shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-gray-600">Biomarkers Tracked</span>
            <div className="p-2.5 rounded-xl bg-purple-100/70 text-purple-600">
              <Activity size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-gray-900 font-heading">18</p>
            <p className="text-xs text-gray-400 font-normal mt-1">Lab report values evaluated</p>
          </div>
        </div>
      </div>

      {/* Interactive Drag & Drop Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border rounded-2xl p-6 bg-white shadow-sm transition-all duration-200 ${
          isDragging ? 'border-[#8989ba] bg-[#8989ba]/10 ring-4 ring-[#8989ba]/20 scale-[1.01]' : 'border-gray-200'
        }`}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-gray-900 font-heading">Instant Document Upload Zone</h3>
              <p className="text-xs text-gray-500">Drag prescription photos or lab report PDFs directly into this area</p>
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#8989ba] transition-colors relative cursor-pointer group bg-gray-50/40 hover:bg-[#8989ba]/5">
            <input 
              type="file" 
              multiple 
              onChange={handleFileSelect} 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            />
            <div 
              className="h-12 w-12 rounded-full text-white flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-xs"
              style={{ backgroundImage: 'linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)' }}
            >
              <Plus size={24} />
            </div>
            <p className="text-sm font-bold text-gray-800 group-hover:text-[#8989ba] transition-colors">
              Drag & drop medical files here, or <span className="text-[#8989ba] underline">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG images and PDF report documents</p>
          </div>
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
              <h4 className="text-base font-bold text-gray-900 font-heading">Recent Prescriptions</h4>
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
                  <p className="font-semibold text-gray-800 text-[13px]">{med.drugName} <span className="text-xs font-normal text-gray-500">({med.dosage})</span></p>
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
              <h4 className="text-base font-bold text-gray-900 font-heading">Biomarker Health Summary</h4>
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
            {mockBiomarkers.slice(0, 2).map((bio) => {
              const style = getBiomarkerStatusStyle(bio.status);
              return (
                <div key={bio.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-gray-800 text-[13px]">{bio.name}</p>
                    <p className="text-gray-500 mt-0.5">{bio.value} (Ref: {bio.range})</p>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border flex items-center gap-1.5 ${style.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${style.markerDot}`}></span>
                    {bio.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
