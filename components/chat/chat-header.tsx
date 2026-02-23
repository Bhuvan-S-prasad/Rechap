import { Hash } from "lucide-react";
import { UserAvatar } from "../user-avatar";

interface ChatHeaderProps {
  channelId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({
  channelId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold h-12 flex items-center px-6 border-b border-neutral-800">
      {type === "channel" && <Hash className="w-5 h-5 text-zinc-400 mr-2" />}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="h-5 w-5 mr-2" />
      )}
      <p className="font-semibold text-md text-primary">{name}</p>
    </div>
  );
};
