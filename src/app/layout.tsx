import type { Metadata, Viewport } from "next";
import "../globals.css";

import Login from "./login/page";
import { Toaster } from "sonner";
import { PostProvider } from "../context/postContext";
import Menu from "../components/menu";
import Header from "../components/header";
import AuthProvider from "@/providers/auth";

export const metadata: Metadata = {
  title: "DevColab",
  description: "Where technology meets collaboration!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="bg-default !min-h-screen !h-full !max-h-full md:!overflow-y-hidden">
        <AuthProvider>
          <PostProvider>
            <Header />
            {children}
            <Toaster />
            <Login />
            <Menu />
          </PostProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
