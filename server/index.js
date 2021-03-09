import http from "http";
import logger from "morgan";
import cors from "cors";
import "./config/mongo.js";

import WebSockets from "./utils/WebSockets.js";

// routes
import indexRouter from "./routes/index.js";
import userRouter from "./routes/user.js";
import chatRoomRouter from "./routes/chatRoom.js";
import deleteRouter from "./routes/delete.js";
// middlewares
import { decode } from './middlewares/jwt.js'

import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';

const app = express(); 
const server = createServer(app); 
const socketio = new Server(server);

// Get port from environment and store in Express. 
const port = process.env.PORT || "3000";
app.set("port", port);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/room", decode, chatRoomRouter);
app.use("/delete", deleteRouter);

// catch 404 and forward to error handler 
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist'
  })
});

// Create HTTP server
//socket connection
global.io = socketio.listen(server);
global.io.on('connection', WebSockets.connection)

// Listen on provided port, on all network interfaces
server.listen(port);
// Event listener for HTTP server "listening" event. 
server.on("listening", () => {
  console.log(`Listening on port:: http://localhost:${port}/`)
});