import React from 'react';
import { TrendingUp, Award, ArrowUp } from 'lucide-react';

export default function AltitudeGraph({ currentAltitude, maxAltitude }) {
  const percentage = maxAltitude > 0 ? (currentAltitude / maxAltitude) * 100 : 0;
  
  return (
    <div className="bg-white dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700/50 rounded-xl p-5 shadow-lg flex flex-col h-full transition-all duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm tracking-wider uppercase flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Altitude Metrics
        </h3>
      </div>
      
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
              <ArrowUp className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Current Altitude</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{currentAltitude?.toFixed(1) || 0} <span className="text-sm text-cyan-400">m</span></p>
            </div>
          </div>
        </div>

        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="p-3 bg-amber-500/20 rounded-lg border border-amber-500/30">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Max Altitude Reached</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{maxAltitude?.toFixed(1) || 0} <span className="text-sm text-amber-400">m</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
