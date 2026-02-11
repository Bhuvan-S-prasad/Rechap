import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rechap",
  description: "Real time chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <ClerkProvider>
      <html lang="en">
        <body
          className={`${openSans.variable} antialiased`}
        >
          
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
