import type { Metadata, Viewport } from "next";
import "../globals.css";
import { AuthProvider } from "../context/authContext";
import Menu from "@/components/menu";
import Header from "@/components/header";
import { PostProvider } from "@/context/postContext";
import Login from "./login/page";

export const metadata: Metadata = {
  title: "DevConnect",
  description: "Onde a Tecnologia Encontra a Conexão!",
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
            <Login />
            <Menu />
          </PostProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
