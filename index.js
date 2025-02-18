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
  if (!username) {
    console.log("Username missing in connection attempt");
    socket.emit("error", "Username is required");
    socket.disconnect();
    return;
  }
  if (connectedUsernames.has(username)) {
    console.log(`Connection rejected - username '${username}' already connected`);
    socket.emit("error", "Username already connected");
    socket.disconnect();
  } else {
    connectedUsernames.add(username);
    console.log("username connected: ", username);
    if (connectedUsernames.size === 4) {
      io.emit("start01");
    }
  }
  socket.on("disconnect", () => {
    connectedUsernames.delete(username);
    console.log(`username disconnected: ${username}`);
  });
});

server.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
