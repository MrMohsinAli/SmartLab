import React from 'react';
import { Plus } from 'lucide-react';
import { mockPrescriptions } from '../data/mockData';

export default function PrescriptionsPage({ 
  handleDragOver, 
  handleDragLeave, 
  handleDrop, 
  handleFileSelect, 
  isDragging 
}) {
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
            <Plus size={20} />
          </div>
          <p className="text-sm font-bold text-gray-800 group-hover:text-[#8989ba] transition-colors">
            Upload Prescription Image or <span className="text-[#8989ba] underline">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Supports JPG, JPEG, and PNG image files</p>
        </div>
      </div>

      {/* Prescriptions Data Table */}
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
            {mockPrescriptions.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{row.drugName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{row.dosage}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.interval}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{row.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic">{row.doctor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
