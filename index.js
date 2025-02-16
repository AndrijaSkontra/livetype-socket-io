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

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(3001, () => {
  console.log(`Server running on port 3001`);
});
