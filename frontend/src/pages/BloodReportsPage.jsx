import React, { useState } from 'react';
import { Plus, Info } from 'lucide-react';
import { mockBiomarkers } from '../data/mockData';
import { getBiomarkerStatusStyle } from '../utils/biomarkerStyles';

export default function BloodReportsPage({ 
  handleDragOver, 
  handleDragLeave, 
  handleDrop, 
  handleFileSelect, 
  isDragging 
}) {
  const [activeTipId, setActiveTipId] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-heading">Blood Biomarkers</h2>
          <p className="text-xs text-gray-500">Analyze reference ranges and view clinical alert tags (Hover or click card for clinical tips)</p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border rounded-2xl p-5 bg-white shadow-sm transition-all duration-200 ${
          isDragging ? 'border-[#8989ba] bg-[#8989ba]/10 ring-4 ring-[#8989ba]/20' : 'border-gray-200'
        }`}
      >
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#8989ba] transition-colors relative cursor-pointer group bg-gray-50/40 hover:bg-[#8989ba]/5">
          <input 
            type="file" 
            multiple 
            onChange={handleFileSelect} 
            accept="image/*,.pdf"
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
          />
          <div 
            className="h-10 w-10 rounded-full text-white flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-xs"
            style={{ backgroundImage: 'linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)' }}
          >
            <Plus size={20} />
          </div>
          <p className="text-sm font-bold text-gray-800 group-hover:text-[#8989ba] transition-colors">
            Upload Lab Blood Report or <span className="text-[#8989ba] underline">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Supports multi-column lab blood report PDFs and images</p>
        </div>
      </div>

      {/* Compact Biomarker Cards Grid with Gradient Health Tip Pop-up Tooltip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBiomarkers.map((bio) => {
          const style = getBiomarkerStatusStyle(bio.status);
          const isTipOpen = activeTipId === bio.id;

          return (
            <div 
              key={bio.id} 
              onClick={() => setActiveTipId(isTipOpen ? null : bio.id)}
              className={`border rounded-2xl p-5 bg-white shadow-sm transition-all duration-300 relative group cursor-pointer ${style.cardBorder} ${style.pulseClass}`}
            >
              <div>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="flex items-center gap-1.5">
                    {style.icon}
                    <h3 className="font-bold text-gray-900 text-sm leading-snug">{bio.name}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${style.badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${style.markerDot}`}></span>
                    {bio.status}
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900 font-heading">{bio.value}</span>
                    <span className="text-xs text-gray-400">Ref: {bio.range}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#8989ba] flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <Info size={13} /> Tip
                  </span>
                </div>
              </div>

              {/* Floating Gradient Pop-up Tooltip (Matching Daily Health Tip) */}
              <div 
                style={{ backgroundImage: 'linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)' }}
                className={`absolute left-0 right-0 top-full mt-2 z-30 p-4 rounded-2xl border border-white/80 shadow-xl text-xs transition-all duration-200 ${
                  isTipOpen 
                    ? 'opacity-100 visible translate-y-0' 
                    : 'opacity-0 invisible -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  <Info size={13} className="text-slate-800" /> Clinical Tip
                </div>
                <p className="text-slate-900 text-xs leading-relaxed font-semibold">
                  {bio.tip}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
