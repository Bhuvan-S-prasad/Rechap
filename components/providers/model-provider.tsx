"use client";

import { CreateChannelModal } from "../modals/create-channel-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { InviteModal } from "../modals/invite-modal";
import { MembersModal } from "../modals/members-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateChannelModal />
      <InviteModal />
      <EditChannelModal />
      <MembersModal />
    </>
  );
};
