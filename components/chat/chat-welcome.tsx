import { Hash } from "lucide-react";


interface ChatWelcomeProps {
    type: "room" | "conversation";
    name: string;
}

export const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
    return (
        <div className="mt-90 space-y-2 px-4 mb-4">
            {type === "room" && (
                <div className="h-12 w-12 rounded-full bg-zinc-500 flex items-center justify-center">
                    <Hash className="h-6 w-6 text-white" />
                </div>
            )}
            <p className="text-xl md:text-3xl font-bold text-white">
                {type === "room" ? "Welcome to #" : " "}
                {name}
            </p>
            <p className="text-zinc-500 text-sm">
                {type === "room" ? `This is the start of #${name}` : "This is the start of your conversation."}
            </p>
        </div>
    );
};