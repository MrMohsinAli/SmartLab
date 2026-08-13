import React, { useState } from 'react';
import { User, Plus, Check, ChevronDown, UserPlus } from 'lucide-react';

export default function PatientDropdown({ 
  isOpen, 
  onToggle, 
  uploadedFilesCount,
  activePatient,
  patients = [],
  onSelectPatient,
  onCreatePatient
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      setErrorMsg('First and last name are required');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await onCreatePatient({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        email: email.trim() || undefined,
      });
      setFirstName('');
      setLastName('');
      setEmail('');
      setShowAddForm(false);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = activePatient ? `${activePatient.first_name} ${activePatient.last_name}` : "Mohsin Ali";
  const displayId = activePatient ? activePatient.id.slice(0, 8).toUpperCase() : "PAT-8842";

  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className="flex items-center gap-2 px-3.5 py-1.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
      >
        <User size={16} className="text-[#8989ba]" />
        <span className="font-semibold text-gray-800 truncate max-w-[110px]">{displayName}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed left-4 right-4 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-auto mt-2 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 space-y-3">
          {/* Active Profile Info Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[#8989ba]/15 text-[#6a699a] flex items-center justify-center font-bold text-sm">
                <User size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{displayName}</p>
                <p className="text-[11px] text-gray-400 font-mono">ID: {displayId}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              Active Profile
            </span>
          </div>

          {/* Registered Patients List Switcher */}
          {!showAddForm ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                <span>Select Patient Profile:</span>
                <button 
                  onClick={() => setShowAddForm(true)}
                  className="text-[#8989ba] hover:text-[#6a699a] flex items-center gap-1 font-bold text-[11px]"
                >
                  <UserPlus size={13} /> Add New
                </button>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {patients.length === 0 ? (
                  <div 
                    onClick={() => onSelectPatient && onSelectPatient(null)}
                    className="p-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs cursor-pointer hover:bg-gray-100"
                  >
                    <div>
                      <p className="font-bold text-gray-800">{displayName}</p>
                      <p className="text-[10px] text-gray-400">Default Local Profile</p>
                    </div>
                    <Check size={14} className="text-emerald-600" />
                  </div>
                ) : (
                  patients.map((p) => {
                    const isSelected = activePatient && activePatient.id === p.id;
                    return (
                      <div 
                        key={p.id}
                        onClick={() => onSelectPatient && onSelectPatient(p)}
                        className={`p-2 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#8989ba]/10 border-[#8989ba]/40' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        <div>
                          <p className="font-bold text-gray-800">{p.first_name} {p.last_name}</p>
                          <p className="text-[10px] text-gray-400 truncate max-w-[170px]">{p.email || `ID: ${p.id.slice(0, 8)}`}</p>
                        </div>
                        {isSelected && <Check size={14} className="text-[#8989ba]" />}
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1 text-[11px] text-gray-500">
                <div className="flex justify-between">
                  <span>Uploaded Session Files:</span>
                  <span className="font-bold text-gray-800">{uploadedFilesCount} file(s)</span>
                </div>
              </div>
            </div>
          ) : (
            /* Add New Patient Form */
            <form onSubmit={handleRegister} className="space-y-2.5 pt-1">
              <div className="flex justify-between items-center pb-1 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <UserPlus size={14} className="text-[#8989ba]" /> New Patient Profile
                </span>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="text-[11px] text-gray-400 hover:text-gray-600 font-semibold"
                >
                  Cancel
                </button>
              </div>

              {errorMsg && (
                <p className="text-[10px] text-red-600 font-semibold bg-red-50 p-1.5 rounded-lg border border-red-200">{errorMsg}</p>
              )}

              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="text" 
                  placeholder="First Name *"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#8989ba]"
                />
                <input 
                  type="text" 
                  placeholder="Last Name *"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#8989ba]"
                />
              </div>

              <input 
                type="email" 
                placeholder="Email Address (Optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-[#8989ba]"
              />

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-1.5 bg-[#8989ba] hover:bg-[#6a699a] text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Registering..." : "Save Patient Profile"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
