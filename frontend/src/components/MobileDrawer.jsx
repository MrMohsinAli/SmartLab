import React from "react";
import { X, User } from "lucide-react";
import DailyHealthTip from "../components/DailyHealthTip";

export default function MobileDrawer({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  menuItems,
  activePatient,
}) {
  if (!isOpen) return null;

  const displayName = activePatient ? `${activePatient.first_name} ${activePatient.last_name}` : "Mohsin Ali";
  const displayId = activePatient ? activePatient.id.slice(0, 8).toUpperCase() : "PAT-8842";

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-64 bg-white border-r border-gray-200 p-6 flex flex-col h-full z-10">
        <div className="flex items-center justify-between mb-8">
          <div
            onClick={() => {
              setActiveTab("dashboard");
              onClose();
            }}
            className="cursor-pointer select-none"
          >
            <h1 className="text-lg font-black tracking-tight font-heading flex items-center gap-0.5">
              <span className="text-slate-950">Smart</span>
              <span className="text-[#8989ba] font-light">Lab</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#8989ba] inline-block ml-0.5"></span>
            </h1>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900"
          >
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
                  onClose();
                }}
                style={
                  isActive
                    ? {
                        backgroundImage:
                          "linear-gradient(to top, #a7a6cb 0%, #8989ba 52%, #8989ba 100%)",
                      }
                    : {}
                }
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${
                  isActive
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Drawer Footer - Static Active Patient Info & Health Tip */}
        <div className="mt-auto pt-6 border-t border-gray-100 space-y-4">
          <DailyHealthTip />

          <div className="flex items-center gap-3 px-1 py-1">
            <div className="h-9 w-9 rounded-full bg-[#8989ba]/20 text-[#6a699a] flex items-center justify-center font-bold text-xs shrink-0">
              <User size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-800 truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-gray-400 font-medium truncate">
                ID: {displayId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
