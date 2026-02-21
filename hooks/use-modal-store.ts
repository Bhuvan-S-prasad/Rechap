import { Channel, Room, RoomType } from "@/generated/prisma/client";
import { create } from "zustand";

export type ModalType = "createChannel" | "invite" | "editChannel" | "members" | "createRoom" | "leaveChannel" | "deleteChannel" | "deleteRoom";

interface ModalData {
  channel?: Channel;
  room?: Room;
  roomType?: RoomType;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ type, data, isOpen: true }),
  onClose: () => set({ type: null, isOpen: false }),
}));
