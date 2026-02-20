'use client'

import { Search } from "lucide-react";
import { useState } from "react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { useParams, useRouter } from "next/navigation";

interface ChannelSearchProps {
    data: {
        label: string;
        type: "member" | "room";
        data: {
            icon: React.ReactNode;
            id: string;
            name: string;
            
        }[] | undefined
    }[]
}


export const ChannelSearch = ({data}: ChannelSearchProps) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    const onClick = ({id, type}: {id: string, type: "member" | "room"}) => {
        setOpen(false);
        if(type === "member") {
            router.push(`/channels/${params?.serverId}/conversations/${id}`)
        } else {
            router.push(`/channels/${params?.serverId}/rooms/${id}`)
        }
    }
    return (
        <>
        <button 
        onClick={() => setOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            <Search className="w-4 h-4" />
            <p className="font-semibold text-sm text-zinc-400 group-hover:text-zinc-300 transition">search</p>
        </button>
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {data.map((section) => (
                    <CommandGroup key={section.label} heading={section.label}>
                        {section.data?.length === 0 && (
                            <CommandItem>
                                No {section.label} found.
                            </CommandItem>
                        )}
                        {section.data?.map((item) => (
                            <CommandItem
                            onSelect={() => onClick({id: item.id, type: section.type})}
                            key={item.id} value={item.name}>
                                {item.icon}
                                <span className="ml-2">{item.name}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                ))}
            </CommandList>
        </CommandDialog>
        </>
    )
}