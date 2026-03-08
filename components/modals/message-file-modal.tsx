"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "../ui/button";
import { FileUpload } from "@/components/file-upload";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required",
  }),
});

export const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "messageFile";
  const { apiUrl, query } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      });
      form.reset();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card text-primary p-0 overflow-hidden sm:max-w-md border-none">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Attachments
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Attach files to your message.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
            <div className="space-y-8 px-6">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-primary">
                        Attach File
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center justify-center text-center">
                          <FileUpload
                            endpoint="messageFile"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-muted px-6 py-4">
              <Button
                disabled={isLoading}
                variant="primary"
                className="w-full  bg-emerald-500 text-black hover:bg-emerald-600"
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
