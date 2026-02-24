import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as SocketIO } from "socket.io";
import { NextApiResponseServerIO } from "../../../types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const httpServer = res.socket.server as unknown as NetServer;
    const io = new SocketIO(httpServer, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;
