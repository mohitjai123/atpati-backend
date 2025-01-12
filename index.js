const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const express = require('express');
const http = require('http');
// const {connection} = require("./connection.js")
const WebSocket = require('ws');
const cors = require("cors");
const multer = require('multer');
const userRoutes = require("./router/userRouter.js")
const movieRoutes = require("./router/movieRoutes.js")
const categoriesRoutes = require("./controllers/categoryController.js")
const trailerRoutes  = require("./router/trailerRoutes.js")
const episodeRoutes  = require("./router/episodeRoute.js")

// Set up file upload
const upload = multer({ dest: 'uploads/' });
const app = express();
const server = http.createServer(app); 
const wss = new WebSocket.Server({ server:server } );

wss.on('connection', (ws) => {
  console.log('Client connected to WebSocket');
  ws.on('close', () => console.log('Client disconnected'));
});

app.use((req, res, next) => {
  req.wss = wss; // Attach WebSocket instance to the request object
  next();
});

// Set FFmpeg path (make sure this is correct)
ffmpeg.setFfmpegPath("C:/ffmpeg/ffmpeg.exe");

// Enable Cross-Origin Resource Sharing
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/output', express.static(path.join(__dirname, 'output')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api", userRoutes)
app.use("/api", movieRoutes)
app.use("/api", categoriesRoutes)
app.use("/api", trailerRoutes)
app.use("/api", episodeRoutes)
// Start the Express server
server.listen(3300, () => {
  console.log('Server running on http://localhost:3300');
});
