import React from 'react';
import { Plus, Loader2, Inbox } from 'lucide-react';

export default function PrescriptionsPage({ 
  handleDragOver, 
  handleDragLeave, 
  handleDrop, 
  handleFileSelect, 
  isDragging,
  prescriptions = [],
  isUploading = false
}) {
  const displayPrescriptions = prescriptions || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-heading">Digitized Prescriptions</h2>
          <p className="text-xs text-gray-500">View and upload your handwritten prescription notes</p>
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
            accept=".jpg,.jpeg,.png,image/jpeg,image/png,image/jpg"
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
          />
          <div 
            className="h-10 w-10 rounded-full text-white flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform shadow-xs"
            style={{ backgroundImage: 'linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)' }}
          >
            {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
          </div>
          <p className="text-sm font-bold text-gray-800 group-hover:text-[#8989ba] transition-colors">
            {isUploading ? "Uploading & Extracting Prescription..." : "Upload Handwritten Prescription Image or browse"}
          </p>
          <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, and JPEG images</p>
        </div>
      </div>

      {/* Prescriptions Table */}
      <div className="border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-900 text-sm">Parsed Medication Routines</h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#8989ba]/15 text-[#6a699a]">
            {displayPrescriptions.length} Records
          </span>
        </div>
        {displayPrescriptions.length === 0 ? (
          <div className="py-12 text-center bg-white flex flex-col items-center justify-center space-y-2">
            <div className="p-3.5 rounded-full bg-gray-50 text-gray-400 border border-gray-100 mb-1">
              <Inbox size={28} />
            </div>
            <p className="text-sm font-bold text-gray-800">No Prescriptions Digitized Yet</p>
            <p className="text-xs text-gray-400 max-w-sm">
              Upload a prescription photo above to let SmartLab automatically extract drug names, dosages, and interval routines.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/70 text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Medication Name</th>
                  <th className="px-6 py-3.5 font-bold">Dosage</th>
                  <th className="px-6 py-3.5 font-bold">Frequency Interval</th>
                  <th className="px-6 py-3.5 font-bold">Treatment Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {displayPrescriptions.map((med, idx) => (
                  <tr key={med.id || idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{med.drugName}</td>
                    <td className="px-6 py-4">{med.dosage}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                        {med.interval}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{med.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
