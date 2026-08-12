import React, { useState, useEffect } from 'react';
import { dietTips } from '../data/mockData';

export default function DailyHealthTip() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prevIndex) => (prevIndex + 1) % dietTips.length);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const currentItem = dietTips[currentTipIndex];
  const tipText = typeof currentItem === 'string' ? currentItem : currentItem?.tip;
  const categoryText = currentItem?.category ? `💡 ${currentItem.category}` : '💡 Daily Health Tip';

  return (
    <div 
      className="rounded-2xl p-4 text-slate-900 shadow-sm relative overflow-hidden transition-all duration-300 min-h-[95px] flex flex-col justify-between border border-white/60"
      style={{ backgroundImage: 'linear-gradient(to top, #f3e7e9 0%, #e3eeff 99%, #e3eeff 100%)' }}
    >
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[9px] uppercase tracking-wider font-bold text-slate-800">
          <span className="truncate pr-2">{categoryText}</span>
          <span className="text-[8px] bg-slate-900/10 text-slate-800 px-1.5 py-0.5 rounded-full font-mono font-bold shrink-0">
            {currentTipIndex + 1}/{dietTips.length}
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-900 leading-relaxed transition-opacity duration-300">
          {tipText}
        </p>
      </div>
    </div>
  );
}
