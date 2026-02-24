import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";
import { Channel, Member, User } from "./generated/prisma/client";

export type ChannelWithMembersWithProfiles = Channel & {
  members: Member & { profile: User };
};

export type NextApiResponseServerIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
