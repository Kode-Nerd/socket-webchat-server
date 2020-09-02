require("dotenv").config();

const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const log = require(__dirname + "/helpers/log");

const PORT = process.env.PORT || 80;

const socketNamespace = io.of("/socket");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, "public")));
app.post('/admin/broadcast', (req, res, next) => {
  const { text } = req.body;
  const message = {
    type: "text",
    sender: "admin",
    text,
    created: new Date().getTime()
  }
  log(message);
  socketNamespace.emit("message", message);

  res.status(200).send({ message });
})
app.post('/admin/typing', (req, res, next) => {
  const { setting } = req.query;
  const event = setting === "true" ? true : setting === "false" ? false : false;
  const typing = {
    user: "admin",
    event
  }
  log({ typing });
  socketNamespace.emit("typing", typing);

  res.status(200).send({ typing });
})

socketNamespace.on("connect", (socket) => {
  log("a user connected", socket.id);
  const event = {
    type: "event",
    user: socket.id,
    event: "connected",
    created: socket.handshake.issued
  }
  log(event);
  socketNamespace.emit("message", event);

  socket.on("message", (text) => {
    const message = {
      type: "text",
      sender: socket.id,
      text,
      created: socket.handshake.issued
    }
    log(message);
    socketNamespace.emit("message", message);
  })

  socket.on("typing", (event) => {
    const typing = {
      user: socket.id,
      event
    }
    log({ typing });
    socket.broadcast.emit("typing", typing);
  })

  socket.on("disconnect", () => {
    log("a user disconnected", socket.id)
    const event = {
      type: "event",
      user: socket.id,
      event: "disconnected",
      created: socket.handshake.issued
    }
    log(event);
    socketNamespace.emit("message", event);
  })
})

server.listen(PORT, () => {
  log(`server run on port: ${PORT}`);
})