const storage = require('./storage');

let simulationInterval = null;

function startMockData(io) {
  if (simulationInterval) return;

  // Initial state for simulation
  let temperature = 24.5;
  let humidity = 65.2;
  let pressure = 1012.3;
  let altitude = 45.2;
  let windSpeed = 12.5;
  let direction = 180;
  let lat = 12.9716;
  let lng = 77.5946;

  // Generate initial history
  for (let i = 0; i < 50; i++) {
    const timeOffset = (50 - i) * 5000; // 5 seconds apart
    const data = {
      temperature: temperature + (Math.random() - 0.5) * 2,
      humidity: humidity + (Math.random() - 0.5) * 10,
      pressure: pressure + (Math.random() - 0.5) * 5,
      altitude: Math.max(0, altitude + (Math.random() - 0.5) * 10),
      windSpeed: Math.max(0, windSpeed + (Math.random() - 0.5) * 5),
      direction: (direction + Math.floor(Math.random() * 20 - 10)) % 360,
      latitude: lat + (Math.random() - 0.5) * 0.001,
      longitude: lng + (Math.random() - 0.5) * 0.001,
      timestamp: Date.now() - timeOffset
    };
    storage.addTelemetry(data);
  }

  // Set up periodic updates
  simulationInterval = setInterval(() => {
    // Slighly vary the data
    temperature += (Math.random() - 0.5) * 0.4;
    humidity += (Math.random() - 0.5) * 1.5;
    pressure += (Math.random() - 0.5) * 0.2;
    altitude += (Math.random() - 0.5) * 2;
    windSpeed += (Math.random() - 0.5) * 1.2;
    direction = (direction + Math.floor(Math.random() * 10 - 5) + 360) % 360;
    lat += (Math.random() - 0.5) * 0.0001;
    lng += (Math.random() - 0.5) * 0.0001;

    // Boundaries
    temperature = Math.min(Math.max(temperature, 15), 35);
    humidity = Math.min(Math.max(humidity, 30), 95);
    pressure = Math.min(Math.max(pressure, 950), 1050);
    altitude = Math.max(0, altitude);
    windSpeed = Math.max(0, Math.min(windSpeed, 80));

    const newData = {
      temperature: parseFloat(temperature.toFixed(2)),
      humidity: parseFloat(humidity.toFixed(2)),
      pressure: parseFloat(pressure.toFixed(2)),
      altitude: parseFloat(altitude.toFixed(2)),
      windSpeed: parseFloat(windSpeed.toFixed(2)),
      direction: Math.floor(direction),
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lng.toFixed(6)),
      timestamp: Date.now()
    };

    const savedData = storage.addTelemetry(newData);
    
    if (io) {
      io.emit('telemetry_update', savedData);
    }
  }, 2000); // Update every 2 seconds
}

function stopMockData() {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
  }
}

module.exports = {
  startMockData,
  stopMockData
};
