import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
/* import Login from "./components/login"; */

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
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="pt-br">
        <body className="bg-default min-h-screen h-full !overflow-y-hidden">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
