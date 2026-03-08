"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import qs from "query-string";
import { useEffect } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Room name is required",
    })
    .refine((name) => name !== "general", {
      message: "Room name cannot be general",
    }),
  type: z.enum(["TEXT", "AUDIO", "VIDEO"]),
});

export const EditRoomModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === "editRoom";
  const { channel, room } = data;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "TEXT",
    },
  });

  useEffect(() => {
    if (room) {
      form.setValue("name", room.name);
      form.setValue("type", room.type);
    }
  }, [form, room]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/rooms/${room?.id}`,
        query: {
          channelId: channel?.id,
        },
      });
      await axios.patch(url, values);
      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card text-card-foreground p-0 overflow-hidden sm:max-w-md border-none">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Room
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground">
                      Room Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-background border border-border focus-visible:ring-0 text-foreground focus-visible:ring-offset-0"
                        placeholder="Enter room name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-muted-foreground">
                      Room Type
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background border border-border focus-visible:ring-0 text-foreground focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TEXT">Text</SelectItem>
                        <SelectItem value="AUDIO">Audio</SelectItem>
                        <SelectItem value="VIDEO">Video</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-muted px-6 py-4">
              <Button disabled={isLoading} variant="primary" className="w-full bg-emerald-500 hover:bg-emerald-600 text-black">
                Edit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
