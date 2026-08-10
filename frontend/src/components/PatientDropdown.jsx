import React from 'react';
import { User } from 'lucide-react';
import { patientInfo } from '../data/mockData';

export default function PatientDropdown({ isOpen, onToggle, uploadedFilesCount }) {
  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className="flex items-center gap-2 px-3.5 py-1.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
      >
        <User size={16} className="text-[#8989ba]" />
        <span>Patient</span>
      </button>

      {isOpen && (
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
              <span className="font-semibold text-gray-800">{uploadedFilesCount} file(s)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Status:</span>
              <span className="font-semibold text-emerald-600">{patientInfo.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
