import { MessageCircle } from "lucide-react";

const DirectMessagesPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-chat-background">
      <MessageCircle className="h-16 w-16 text-zinc-500 mb-4" />
      <h2 className="text-xl font-semibold text-zinc-400">
        Select a conversation
      </h2>
      <p className="text-sm text-zinc-500 mt-1">
        Choose a friend from the sidebar to start chatting
      </p>
    </div>
  );
};

export default DirectMessagesPage;
