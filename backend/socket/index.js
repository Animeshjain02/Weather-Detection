const storage = require('../services/storage');

module.exports = function(io) {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Send immediate latest data and history upon connection
    const latest = storage.getLatestTelemetry();
    const history = storage.getTelemetryHistory();
    
    if (latest) {
      socket.emit('telemetry_update', latest);
    }
    
    if (history && history.length > 0) {
      socket.emit('telemetry_history', history);
    }
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
