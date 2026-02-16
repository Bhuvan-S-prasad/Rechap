"use client";

import { CreateChannelModal } from "../modals/create-channel-modal";
import { InviteModal } from "../modals/invite-modal";

export const ModalProvider = () => {
  return (
    <>
      <CreateChannelModal />
      <InviteModal />
    </>
  );
};
