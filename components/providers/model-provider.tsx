"use client";

import { CreateChannelModal } from "../modals/create-channel-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
import { InviteModal } from "../modals/invite-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateChannelModal />
      <InviteModal />
      <EditChannelModal />
    </>
  );
};
