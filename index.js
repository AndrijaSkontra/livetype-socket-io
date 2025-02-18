import "dotenv/config";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.FE_URL,
  }),
);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FE_URL,
  },
});

const connectedUsernames = new Set();

io.on("connection", (socket) => {
  const username = socket.handshake.query.username;
  if (connectedUsernames.has(username)) {
    console.log("Already connected go away son");
    socket.disconnect();
  } else {
    connectedUsernames.add(username);
    console.log("username connected: ", username);
    // console log all socket ids
    //const connectedSocketIds = Array.from(io.sockets.sockets.keys());
    //console.log("Connected socket IDs:", connectedSocketIds);
    if (connectedUsernames.size === 4) {
      io.emit("start01");
    }
  }
});

server.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
