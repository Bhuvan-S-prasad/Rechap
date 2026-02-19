"use client";

import { CreateChannelModal } from "../modals/create-channel-modal";
import { CreateRoomModal } from "../modals/create-room-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { InviteModal } from "../modals/invite-modal";
import { MembersModal } from "../modals/members-modal";
import { LeaveChannelModal } from "../modals/leave-channel-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateChannelModal />
      <InviteModal />
      <EditChannelModal />
      <MembersModal />
      <CreateRoomModal />
      <LeaveChannelModal />
      <DeleteChannelModal />
    </>
  );
};
