const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());
app.use(express.json());

// Set up Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Import socket handler
const setupSocket = require('./socket');
setupSocket(io);

// Start mock data generator
const mockGenerator = require('./services/mockGenerator');
mockGenerator.startMockData(io);

// Make io accessible to our routes
app.set('io', io);

// Import routes
const telemetryRoutes = require('./routes/telemetry');
app.use('/api', telemetryRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
