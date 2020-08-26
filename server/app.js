const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const log = require(__dirname + "/helpers/log");

const PORT = process.env.PORT || 3030;

io.on("connect", (socket) => {
  log("a user connected");
  socket.on("disconnect", () => {
    log("a user disconnected")
  })
})

server.listen(PORT, () => {
  log(`server run on port: ${PORT}`);
})