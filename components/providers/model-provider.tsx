"use client";

import { CreateChannelModal } from "../modals/create-channel-modal";
import { CreateRoomModal } from "../modals/create-room-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { InviteModal } from "../modals/invite-modal";
import { MembersModal } from "../modals/members-modal";
import { LeaveChannelModal } from "../modals/leave-channel-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";
import { DeleteRoomModal } from "../modals/delete-room-modal";
import { EditRoomModal } from "../modals/edit-room-modal";
import { MessageFileModal } from "../modals/message-file-modal";
import { DeleteMessageModal } from "../modals/delete-message-modal";
import { UserProfileModal } from "../modals/user-profile-modal";

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
      <DeleteRoomModal />
      <EditRoomModal />
      <MessageFileModal />
      <DeleteMessageModal />
      <UserProfileModal />
    </>
  );
};
