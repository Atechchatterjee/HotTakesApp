import { NextApiRequest } from "next";
import { Server } from "socket.io";
import { NextApiResponseWithSocket } from "types/socketServerTypes";

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocket) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
    const io = new Server(res.socket.server, { path: "/api/socket" });
    io.on("hello", (msg) => {
      console.log(msg);
    });
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server, { path: "/api/socket" });
    io.on("connect", (socket) => {
      console.log("client connected ", socket.id);
    });
    io.on("hello", (msg) => {
      console.log(msg);
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
