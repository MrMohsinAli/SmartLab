import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationsDropdown({ isOpen, onToggle }) {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Prescription Processed', desc: 'Paracetamol 500mg dosage routine extracted successfully.', time: '10m ago', unread: true },
    { id: 2, title: 'Biomarker Alert', desc: 'Cholesterol level flagged as CRITICAL (245 mg/dL).', time: '1h ago', unread: true },
    { id: 3, title: 'OCR Engine Ready', desc: 'SmartLab clinical rules evaluation engine activated.', time: '3h ago', unread: false },
  ]);

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(item => item.id === id ? { ...item, unread: false } : item)
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative">
      <button 
        onClick={onToggle}
        className="p-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors relative cursor-pointer" 
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#8989ba] ring-2 ring-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 z-50 space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                unreadCount > 0 ? 'bg-[#8989ba]/15 text-[#6a699a]' : 'bg-gray-100 text-gray-500'
              }`}>
                {unreadCount > 0 ? `${unreadCount} New` : 'All Read'}
              </span>
            </div>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {notifications.map((item) => (
              <div 
                key={item.id} 
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-3 rounded-xl border text-xs transition-all duration-200 cursor-pointer ${
                  item.unread 
                    ? 'bg-gray-50 border-gray-200 hover:bg-gray-100/80 shadow-2xs' 
                    : 'bg-gray-50/40 border-gray-100/60 opacity-55 text-gray-500'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold text-xs flex items-center gap-1.5 ${item.unread ? 'text-gray-900' : 'text-gray-500'}`}>
                    {item.unread && <span className="h-1.5 w-1.5 rounded-full bg-[#8989ba] shrink-0"></span>}
                    {item.title}
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">{item.time}</span>
                </div>
                <p className={`text-[11px] leading-relaxed ${item.unread ? 'text-gray-600' : 'text-gray-400'}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
