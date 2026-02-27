"use client";

import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onChange: (value: string) => void;
}

export const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="text-zinc-400 hover:text-zinc-300 transition" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        sideOffset={40}
        className="mb-16 p-0 border-none bg-transparent shadow-none"
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji: { native: string }) => onChange(emoji.native)}
          theme="dark"
        />
      </PopoverContent>
    </Popover>
  );
};
