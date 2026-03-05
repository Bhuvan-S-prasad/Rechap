"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { useRouter } from "next/navigation";

interface DMSearchProps {
  data: {
    label: string;
    data:
      | {
          icon: React.ReactNode;
          id: string;
          name: string;
        }[]
      | undefined;
  }[];
}

export const DMSearch = ({ data }: DMSearchProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onClick = (id: string) => {
    setOpen(false);
    router.push(`/direct-messages/${id}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <Search className="w-4 h-4 text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-400 group-hover:text-zinc-300 transition">
          Find or start a conversation
        </p>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search conversations..." />
        <CommandList>
          <CommandEmpty>No conversations found.</CommandEmpty>
          {data.map((section) => (
            <CommandGroup key={section.label} heading={section.label}>
              {section.data?.length === 0 && (
                <CommandItem>
                  No {section.label.toLowerCase()} found.
                </CommandItem>
              )}
              {section.data?.map((item) => (
                <CommandItem
                  onSelect={() => onClick(item.id)}
                  key={item.id}
                  value={item.name}
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
