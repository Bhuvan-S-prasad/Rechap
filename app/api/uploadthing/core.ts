import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return { userId };
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete((data) => {
      return { url: data.file.url, ufsUrl: data.file.ufsUrl };
    }),

  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete((data) => {
      return { url: data.file.url, ufsUrl: data.file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
