"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Plus, Smile } from "lucide-react";
import axios from "axios";
import qs from "query-string";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, string>;
  name: string;
  type: "channel" | "conversation";
}

const formschema = z.object({
  content: z.string().min(1, {
    message: "Message cannot be empty",
  }),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const form = useForm<z.infer<typeof formschema>>({
    resolver: zodResolver(formschema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formschema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-3">
                  <button
                    type="button"
                    onClick={() => {}}
                    className="absolute top-7 left-8 h-[24px] w-[24px] rounded-md hover:bg-zinc-600 transition rounded-fill p-1 flex items-center justify-center"
                  >
                    <Plus className="text-zinc-200 h-4 w-4" />
                  </button>
                  <Input
                    disabled={isLoading}
                    className="px-14 py-6 bg-input-bg border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-200"
                    placeholder={`message ${type === "conversation" ? name : "#" + name}`}
                    {...field}
                  />
                  <div className="absolute top-7 right-8">
                    <Smile className="text-zinc-200 h-4 w-4" />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
