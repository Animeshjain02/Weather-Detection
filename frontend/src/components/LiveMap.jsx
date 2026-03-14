import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Activity, Target, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

// Create a pulsing live marker icon
const liveIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="marker-pulse-container">
          <div class="marker-pulse"></div>
          <div class="marker-dot"></div>
        </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});


// Standard icon for user
const userIcon = L.divIcon({
  className: 'user-marker-icon',
  html: `<div class="user-marker-dot"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});


function MapControls({ center, userPos, isFollowing, setIsFollowing }) {
  const map = useMap();

  useEffect(() => {
    if (isFollowing && center) {
      map.setView(center, map.getZoom());
    }
  }, [center, isFollowing, map]);

  const handleLocateUser = () => {
    if (userPos) {
      setIsFollowing(false);
      map.setView(userPos, 15);
    } else {
      alert("Locating you... please ensure GPS is enabled.");
    }
  };

  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col space-y-2">
      <button 
        onClick={() => setIsFollowing(!isFollowing)}
        className={`p-3 rounded-full shadow-lg border transition-all duration-200 ${
          isFollowing 
            ? 'bg-cyan-500 text-white border-cyan-400' 
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
        }`}
        title={isFollowing ? "Stop Following" : "Follow Station"}
      >
        <Target className={`w-5 h-5 ${isFollowing ? 'animate-pulse' : ''}`} />
      </button>
      <button 
        onClick={handleLocateUser}
        className="p-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
        title="Find My Location"
      >
        <Navigation className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function LiveMap({ currentPosition, pathData, theme, userLocation }) {
  const [isFollowing, setIsFollowing] = useState(true);
  const isDark = theme === 'dark';
  const position = currentPosition && currentPosition.lat ? [currentPosition.lat, currentPosition.lng] : null;
  const userPos = userLocation && userLocation.lat ? [userLocation.lat, userLocation.lng] : null;

  // Use different tile layers for light and dark modes
  const tileUrl = isDark 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 z-0 bg-slate-100 dark:bg-slate-800 transition-colors duration-300">
      {position ? (
        <MapContainer 
          center={position} 
          zoom={15} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={tileUrl}
          />
          
          {/* Path history line */}
          {pathData && pathData.length > 1 && (
            <Polyline 
              pathOptions={{ 
                color: isDark ? '#22d3ee' : '#0ea5e9', 
                weight: 3, 
                opacity: 0.6,
                dashArray: '5, 10'
              }} 
              positions={pathData} 
            />
          )}

          {/* User's Location Marker */}
          {userPos && (
            <Marker position={userPos} icon={userIcon}>
              <Popup>
                <div className="text-slate-900 dark:text-slate-100 font-sans min-w-[120px]">
                  <p className="font-bold border-b border-slate-200 dark:border-slate-700 pb-1 mb-1">Your Location</p>
                  <p className="text-[10px] opacity-70">Lat: {userLocation.lat.toFixed(5)}°</p>
                  <p className="text-[10px] opacity-70">Lng: {userLocation.lng.toFixed(5)}°</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Current Live Marker (Balloon) */}
          <Marker position={position} icon={liveIcon}>
            <Popup>
              <div className="text-slate-900 dark:text-slate-100 font-sans min-w-[180px]">
                <p className="font-bold border-b border-slate-200 dark:border-slate-700 pb-1 mb-1">Station Telemetry</p>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <span>Lat: {currentPosition.lat.toFixed(5)}°</span>
                  <span>Lng: {currentPosition.lng.toFixed(5)}°</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-tighter pt-1 border-t border-slate-100 dark:border-slate-800">Updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </Popup>
          </Marker>
          <MapControls 
            center={position} 
            userPos={userPos}
            isFollowing={isFollowing} 
            setIsFollowing={setIsFollowing} 
          />
        </MapContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-3 bg-slate-50 dark:bg-slate-900/50">
          <div className="relative flex h-8 w-8">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-20"></span>
            <div className="relative inline-flex rounded-full h-8 w-8 bg-cyan-500/20 items-center justify-center">
               <Activity className="w-4 h-4 text-cyan-500" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-300 font-medium">Acquiring Satellite Lock</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs">Waiting for telemetry data stream...</p>
          </div>
        </div>
      )}
    </div>
  );
}
