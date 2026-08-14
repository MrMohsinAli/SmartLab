import React, { useState } from 'react';
import { User, Plus, Check, ChevronDown, UserPlus, KeyRound, ShieldAlert, Lock, LogOut, Loader2 } from 'lucide-react';
import { verifyAdminPassword } from '../services/api';

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
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleUnlockAdminConsole = async (e) => {
    e.preventDefault();
    if (!adminPasscode) {
      setAdminError('Please enter password.');
      return;
    }
    setIsVerifying(true);
    setAdminError('');
    try {
      const res = await verifyAdminPassword(adminPasscode);
      if (res && res.valid) {
        onSelectPatient && onSelectPatient({
          id: 'ADMIN_ALL',
          first_name: 'Admin',
          last_name: 'Console'
        });
        setShowAdminModal(false);
        setAdminPasscode('');
      } else {
        setAdminError('Invalid password. Please try again.');
      }
    } catch (err) {
      setAdminError('Verification error. Please check server connection.');
    } finally {
      setIsVerifying(false);
    }
  };

  const isAdminMode = activePatient && activePatient.id === 'ADMIN_ALL';
  const displayName = isAdminMode ? "Admin Console" : (activePatient ? `${activePatient.first_name} ${activePatient.last_name}` : "Mohsin Ali");
  const displayId = isAdminMode ? "ALL-PROFILES" : (activePatient ? `PAT-${activePatient.id.slice(0, 8).toUpperCase()}` : "PAT-8842");

  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className="flex items-center gap-2 px-3.5 py-1.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors cursor-pointer"
      >
        {isAdminMode ? <Lock size={15} className="text-[#8989ba]" /> : <User size={16} className="text-[#8989ba]" />}
        <span className="font-bold text-gray-800 truncate max-w-[110px]">{displayName}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="fixed left-4 right-4 top-16 sm:absolute sm:left-auto sm:right-0 sm:top-auto mt-2 sm:w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 space-y-3">
          {/* Active Profile Info Header */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm bg-[#8989ba]/15 text-[#6a699a]">
                {isAdminMode ? <Lock size={18} /> : <User size={18} />}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{displayName}</p>
                {!isAdminMode && <p className="text-[11px] text-gray-400 font-mono">ID: {displayId}</p>}
              </div>
            </div>
            {isAdminMode ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectPatient && patients.length > 0) {
                    onSelectPatient(patients[0]);
                  }
                }}
                className="px-2.5 py-1 bg-[#8989ba]/15 hover:bg-[#8989ba]/25 text-[#6a699a] font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                title="Exit Admin Mode"
              >
                <LogOut size={13} /> Exit Admin
              </button>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                Active Profile
              </span>
            )}
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

              <div className="max-h-44 overflow-y-auto space-y-1 pr-1">
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
                          <p className="text-[10px] font-mono text-gray-400 truncate max-w-[170px]">ID: PAT-{p.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        {isSelected && <Check size={14} className="text-[#8989ba]" />}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Dedicated Bottom Space: Admin Console Button */}
              <div className="pt-2 border-t border-gray-100">
                <div
                  onClick={() => {
                    if (isAdminMode) {
                      onToggle();
                      return;
                    }
                    setShowAdminModal(true);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-colors ${
                    isAdminMode 
                      ? 'bg-[#8989ba]/20 text-[#6a699a] border-[#8989ba]/40 font-bold' 
                      : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <KeyRound size={15} className="text-[#8989ba] shrink-0" />
                    <span className="font-bold text-gray-800 text-xs">Admin Console</span>
                  </div>
                  {isAdminMode && <Check size={14} className="text-[#8989ba]" />}
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

      {/* Minimalist Premium Admin Security Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#8989ba]/15 text-[#6a699a]">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base font-heading">Admin Console</h3>
                <p className="text-[11px] text-gray-400 font-normal">Aggregates medical documents across all patient profiles</p>
              </div>
            </div>

            {adminError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <ShieldAlert size={16} />
                <span>{adminError}</span>
              </div>
            )}

            <form onSubmit={handleUnlockAdminConsole} className="space-y-3">
              <div>
                <input 
                  type="password"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  placeholder="Enter passcode..."
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#8989ba] shadow-xs"
                  autoFocus
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminError('');
                    setAdminPasscode('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-4 py-2 bg-[#8989ba] hover:bg-[#6a699a] text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isVerifying && <Loader2 size={13} className="animate-spin" />}
                  {isVerifying ? "Verifying..." : "Unlock"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
