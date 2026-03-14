import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import TelemetryCard from './components/TelemetryCard';
import LiveMap from './components/LiveMap';
import LiveChart from './components/LiveChart';
import AltitudeGraph from './components/AltitudeGraph';
import { socket } from './services/socket';
import { Thermometer, Wind, Compass, Mountain, Activity, MapPin, Map } from 'lucide-react';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [telemetryHistory, setTelemetryHistory] = useState([]);
  const [latestData, setLatestData] = useState(null);
  const [maxAltitude, setMaxAltitude] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    // Watch user's browser location
    let watchId = null;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  useEffect(() => {
    // Sync theme with document class
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onTelemetryUpdate(data) {
      setLatestData(data);
      if (data.altitude && data.altitude > maxAltitude) {
        setMaxAltitude(data.altitude);
      }
      setTelemetryHistory(prev => {
        const newHistory = [...prev, data];
        if (newHistory.length > 100) newHistory.shift();
        return newHistory;
      });
    }

    function onTelemetryHistory(history) {
      setTelemetryHistory(history);
      if (history.length > 0) {
        setLatestData(history[history.length - 1]);
        const maxAlt = Math.max(...history.map(item => item.altitude || 0));
        setMaxAltitude(maxAlt);
      }
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('telemetry_update', onTelemetryUpdate);
    socket.on('telemetry_history', onTelemetryHistory);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('telemetry_update', onTelemetryUpdate);
      socket.off('telemetry_history', onTelemetryHistory);
    };
  }, [maxAltitude]);

  const mapPathData = telemetryHistory
    .filter(item => item.latitude && item.longitude)
    .map(item => [item.latitude, item.longitude]);
    
  // Current station position from telemetry
  const currentPosition = latestData && latestData.latitude && latestData.longitude 
    ? { lat: latestData.latitude, lng: latestData.longitude } 
    : null;

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-200 p-6 font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background blobs for premium look */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 dark:opacity-10 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 dark:opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 dark:opacity-10 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <Header isConnected={isConnected} theme={theme} setTheme={setTheme} />

        {/* Top Row: Telemetry Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <TelemetryCard title="Temp" value={latestData?.temperature} unit="°C" icon={Thermometer} colorClass="text-rose-400" />
          <TelemetryCard title="Humidity" value={latestData?.humidity} unit="%" icon={Activity} colorClass="text-sky-400" />
          <TelemetryCard title="Pressure" value={latestData?.pressure} unit="hPa" icon={Activity} colorClass="text-violet-400" />
          <TelemetryCard title="Altitude" value={latestData?.altitude} unit="m" icon={Mountain} colorClass="text-cyan-400" />
          <TelemetryCard title="Wind" value={latestData?.windSpeed} unit="km/h" icon={Wind} colorClass="text-blue-400" />
          <TelemetryCard title="Dir" value={latestData?.direction} unit="°" icon={Compass} colorClass="text-amber-400" />
          <TelemetryCard title="Lat" value={latestData?.latitude} unit="°" icon={MapPin} colorClass="text-emerald-400" />
          <TelemetryCard title="Long" value={latestData?.longitude} unit="°" icon={Map} colorClass="text-emerald-400" />
        </div>

        {/* Middle Row: Large Map & Altitude Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-96">
          <div className="lg:col-span-3 h-full rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50 relative overflow-hidden transition-all duration-300">
            <LiveMap 
              currentPosition={currentPosition} 
              pathData={mapPathData} 
              userLocation={userLocation}
              theme={theme}
            />
          </div>
          <div className="lg:col-span-1 h-full">
            <AltitudeGraph currentAltitude={latestData?.altitude} maxAltitude={maxAltitude} />
          </div>
        </div>

        {/* Bottom Row: Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LiveChart 
            theme={theme}
            title="Altitude (m)" 
            data={telemetryHistory.map(d => ({ value: d.altitude, timestamp: d.timestamp }))} 
            colorClass="text-cyan-400"
            borderHex="#06b6d4"
            fillHex="rgba(6, 182, 212, 0.1)"
          />
          <LiveChart 
            theme={theme}
            title="Temperature (°C)" 
            data={telemetryHistory.map(d => ({ value: d.temperature, timestamp: d.timestamp }))} 
            colorClass="text-rose-400"
            borderHex="#f43f5e"
            fillHex="rgba(244, 63, 94, 0.1)"
          />
          <LiveChart 
            theme={theme}
            title="Humidity (%)" 
            data={telemetryHistory.map(d => ({ value: d.humidity, timestamp: d.timestamp }))} 
            colorClass="text-sky-400"
            borderHex="#0ea5e9"
            fillHex="rgba(14, 165, 233, 0.1)"
          />
          <LiveChart 
            theme={theme}
            title="Wind Speed (km/h)" 
            data={telemetryHistory.map(d => ({ value: d.windSpeed, timestamp: d.timestamp }))} 
            colorClass="text-blue-400"
            borderHex="#3b82f6"
            fillHex="rgba(59, 130, 246, 0.1)"
          />
          <LiveChart 
            theme={theme}
            title="Pressure (hPa)" 
            data={telemetryHistory.map(d => ({ value: d.pressure, timestamp: d.timestamp }))} 
            colorClass="text-violet-400"
            borderHex="#8b5cf6"
            fillHex="rgba(139, 92, 246, 0.1)"
          />
          <div className="bg-white dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700/50 flex flex-col justify-center items-center text-center space-y-4 shadow-lg transition-all duration-300">
             <div className="p-3 bg-emerald-500/10 rounded-full">
               <Activity className="w-8 h-8 text-emerald-400" />
             </div>
             <div>
               <h4 className="text-slate-900 dark:text-slate-200 font-semibold">System Optimal</h4>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Receiving real-time ground level telemetry from sensor suite.</p>
             </div>
             <div className="flex gap-2">
               <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded text-[10px] text-slate-500 dark:text-slate-400 font-mono border border-slate-200 dark:border-transparent">STATION: A-01</span>
               <span className="px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded text-[10px] text-slate-500 dark:text-slate-400 font-mono border border-slate-200 dark:border-transparent">LAT: {latestData?.latitude}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
