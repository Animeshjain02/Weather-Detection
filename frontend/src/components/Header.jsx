import React, { useState, useEffect } from 'react';
import { Activity, Wifi, WifiOff, Sun, Moon } from 'lucide-react';

export default function Header({ isConnected, theme, setTheme }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 py-4 px-6 mb-6 flex flex-col sm:flex-row items-center justify-between shadow-md rounded-xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4 sm:mb-0">
        <Activity className="text-cyan-400 w-8 h-8" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Weather Balloon Telemetry
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
        </button>
        <div className="text-slate-500 dark:text-slate-400 font-mono text-sm bg-slate-100 dark:bg-slate-900/50 py-1 px-3 border border-slate-200 dark:border-slate-700/50 rounded-lg">
          {time.toLocaleTimeString()}
        </div>
        {isConnected ? (
          <div className="flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-sm">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-sm tracking-widest uppercase">Live Data</span>
            <Wifi className="w-4 h-4 ml-2" />
          </div>
        ) : (
          <div className="flex items-center px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 backdrop-blur-sm">
            <span className="font-medium text-sm uppercase">Disconnected</span>
            <WifiOff className="w-4 h-4 ml-2" />
          </div>
        )}
      </div>
    </header>
  );
}
