import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, User } from "@/generated/prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type chatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    user: User;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: chatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  type ChatQueryPage = {
    items: MessageWithMemberWithProfile[];
    nextCursor?: string;
  };

  type ChatQueryData = {
    pages: ChatQueryPage[];
    pageParams?: unknown[];
  };

  useEffect(() => {
    if (!socket) return;

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData(
        [queryKey],
        (oldData: ChatQueryData | undefined) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0)
            return oldData;

          const newData = oldData.pages.map((page: ChatQueryPage) => {
            return {
              ...page,
              items: page.items.map((item: MessageWithMemberWithProfile) => {
                if (item.id === message.id) return message;
                return item;
              }),
            };
          });

          return {
            ...oldData,
            pages: newData,
          };
        },
      );
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      queryClient.setQueryData(
        [queryKey],
        (oldData: ChatQueryData | undefined) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [
                {
                  items: [message],
                },
              ],
            };
          }

          const newData = [...oldData.pages];

          newData[0] = {
            ...newData[0],
            items: [message, ...newData[0].items],
          };

          return {
            ...oldData,
            pages: newData,
          };
        },
      );
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, queryKey, socket, updateKey]);
};
