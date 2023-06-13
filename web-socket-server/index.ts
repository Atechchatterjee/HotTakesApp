import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
server.listen(4000);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected ", socket.id);
  socket.on("hello", (msg) => {
    console.log({ msg });
  });
  socket.on("challenged", ({ challenge }) => {
    socket.broadcast.emit("challenge-broadcast", {
      challenge,
    });
  });
  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
  });
  socket.on(
    "send-challenge-message",
    ({ challenge, challengeMessage, to, from }) => {
      socket.broadcast.emit("broadcast-challenge-message", {
        challenge,
        challengeMessage,
        to,
        from,
      });
      console.log({ challenge, challengeMessage, to, from });
    }
  );
});
