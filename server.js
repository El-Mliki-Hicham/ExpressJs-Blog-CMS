// server.js
require('dotenv').config();
const http = require('http');
const app = require('./app');

// Get port from environment or default to 3030
const PORT = process.env.PORT || 3030;

// Create and start the server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});