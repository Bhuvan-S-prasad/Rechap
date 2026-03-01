"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, User } from "@/generated/prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    user: User;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  socketUrl: string;
  socketQuery: Record<string, string>;
  isUpdated: boolean;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-emerald-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  isUpdated,
  socketUrl,
  socketQuery,
  currentMember,
}: ChatItemProps) => {
  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === "ADMIN";
  const isModerator = currentMember.role === "MODERATOR";
  const isOwner = member.id === currentMember.id;
  const canDeleteMessage =
    !deleted && (isAdmin || isModerator || member.id === currentMember.id);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsEditing(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log("[ChatItem Edit]", error);
    }
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  return (
    <div className="relative group flex items-center bg-chat-background hover:bg-background p-4 transition w-full">
      <div className="flex gap-x-2 items-start w-full">
        <div className="cursor-pointer hover:drop-shadow-md transition">
          <UserAvatar src={member.user.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="font-semibold text-sm hover:underline cursor-pointer">
                {member.user.name}
              </p>
              {roleIconMap[member.role] && (
                <ActionTooltip label={member.role}>
                  {roleIconMap[member.role]}
                </ActionTooltip>
              )}
            </div>
            <span className="text-xs text-zinc-400">{timestamp}</span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-zinc-300",
                deleted && "italic text-zinc-400 text-xs mt-1",
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-400">(edited)</span>
              )}
            </p>
          )}

          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center w-full gap-x-2 pt-2 space-y-2"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="p-2 bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200"
                            placeholder="Edited your message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  save
                </Button>
                <span className="text-xs text-zinc-400">
                  press escape to cancel, enter to save
                </span>
              </form>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:block items-center gap-x-2 absolute p-2 -top-2 right-5 dark:bg-zinc-800 z-10 rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <button
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-300 transition"
              >
                <Edit className="h-4 w-4" />
              </button>
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <button
              onClick={() => setIsDeleting(true)}
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            >
              <Trash className="h-4 w-4" />
            </button>
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
