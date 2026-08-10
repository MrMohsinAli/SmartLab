import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

/**
 * Returns color, badge, indicator dot, icon, and animation classes
 * for clinical biomarker status levels (NORMAL, ABNORMAL, CRITICAL).
 */
export const getBiomarkerStatusStyle = (status) => {
  switch (status) {
    case 'NORMAL':
      return {
        cardBorder: 'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300',
        badge: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
        markerDot: 'bg-emerald-500',
        pulseClass: '',
        icon: <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
      };
    case 'ABNORMAL':
      return {
        cardBorder: 'border-amber-200 bg-amber-50/30 hover:border-amber-300',
        badge: 'bg-amber-100 text-amber-900 border border-amber-300',
        markerDot: 'bg-amber-500',
        pulseClass: '',
        icon: <AlertCircle size={16} className="text-amber-600 shrink-0" />
      };
    case 'CRITICAL':
    default:
      return {
        cardBorder: 'border-2 border-red-400/80 bg-red-50/40 shadow-md shadow-red-500/10 ring-4 ring-red-400/20',
        badge: 'bg-red-600 text-white font-extrabold shadow-xs border border-red-500',
        markerDot: 'bg-white animate-ping',
        pulseClass: 'animate-pulse',
        icon: <AlertTriangle size={16} className="text-red-600 shrink-0 animate-bounce" />
      };
  }
};
