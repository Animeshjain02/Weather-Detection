let latestTelemetry = null;
const telemetryHistory = [];
const MAX_HISTORY = 100;

function addTelemetry(data) {
  // Give it a timestamp if it doesn't have one
  if (!data.timestamp) {
    data.timestamp = Date.now();
  }
  
  latestTelemetry = data;
  telemetryHistory.push(data);
  
  if (telemetryHistory.length > MAX_HISTORY) {
    telemetryHistory.shift();
  }
  
  return data;
}

function getLatestTelemetry() {
  return latestTelemetry;
}

function getTelemetryHistory() {
  return telemetryHistory;
}

module.exports = {
  addTelemetry,
  getLatestTelemetry,
  getTelemetryHistory
};
