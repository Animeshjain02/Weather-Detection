import React from 'react';

export default function TelemetryCard({ title, value, unit, icon: Icon, colorClass }) {
  return (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 shadow-lg relative overflow-hidden group hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl transition-all duration-500 group-hover:opacity-20 ${colorClass}`}></div>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm tracking-wider uppercase">{title}</h3>
        {Icon && <Icon className={`w-5 h-5 ${colorClass}`} />}
      </div>
      <div className="flex items-baseline space-x-1">
        <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          {value !== undefined && value !== null 
            ? (title.toLowerCase().includes('lat') || title.toLowerCase().includes('long') 
               ? value.toFixed(4) 
               : value.toFixed(1)) 
            : '--'}
        </span>
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{unit}</span>
      </div>
    </div>
  );
}
