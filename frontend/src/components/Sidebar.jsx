import React from "react";
import { User } from "lucide-react";
import DailyHealthTip from "./DailyHealthTip";
import { patientInfo } from "../data/mockData";

export default function Sidebar({ activeTab, setActiveTab, menuItems }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 p-6 shrink-0 shadow-sm">
      <div
        onClick={() => setActiveTab("dashboard")}
        className="mb-8 cursor-pointer select-none group"
        title="Go to Home Dashboard"
      >
        <h1 className="text-2xl font-black tracking-tight font-heading flex items-center gap-0.5 group-hover:opacity-90 transition-opacity">
          <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-950 bg-clip-text text-transparent">
            Smart
          </span>
          <span className="text-[#8989ba] font-light">Lab</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#8989ba] inline-block ml-0.5"></span>
        </h1>
        <span className="text-[9px] font-bold text-[#8989ba] uppercase tracking-widest block mt-0.5">
          Digitalizing HealthCare
        </span>
      </div>

      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
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
                  ? "text-white shadow-md shadow-[#8989ba]/30"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon
                size={18}
                className={isActive ? "text-white" : "text-gray-400"}
              />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Sidebar Patient Profile & Auto-Rotating Daily Diet Tip Card */}
      <div className="mt-auto pt-6 border-t border-gray-100 space-y-4">
        <DailyHealthTip />

        {/* Patient Profile Footer */}
        <div className="flex items-center gap-3 px-1 py-1">
          <div className="h-9 w-9 rounded-full bg-[#8989ba]/20 text-[#6a699a] flex items-center justify-center font-bold text-xs shrink-0">
            <User size={16} />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-800 truncate">
              {patientInfo.name}
            </p>
            <p className="text-[10px] text-gray-400 font-medium truncate">
              ID: {patientInfo.id}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
