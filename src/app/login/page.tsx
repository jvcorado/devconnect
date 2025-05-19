"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@nextui-org/button";

import Modals from "@/src/components/modalUI/modal";

export default function Login() {
  const router = useRouter();
  const { status } = useSession();
  const [open, setOpen] = useState(false);

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (status === "authenticated") {
      setOpen(false);
      router.push("/");
    } else {
      setOpen(true);
    }
  }, [status]);

  if (status === "loading") return null;

  const handleLoginWithGoogleClick = () =>
    signIn("google", {
      callbackUrl: "/",
    });

  return (
    <Modals
      isOpen={open}
      onOpenChange={() => router.push("/")}
      onClose={() => router.push("/")}
    >
      <div className="flex flex-col gap-5 items-center pt-20 p-10 text-white max-md:overflow-y-auto max-md:max-h-[80vh] max-md:scroll-transparent">
        <h1 className="text-4xl">DevColab</h1>
        <p className="text-lg text-center">
          Where technology meets collaboration!
        </p>

        <Button
          color="primary"
          className="w-full"
          size="lg"
          onPress={handleLoginWithGoogleClick}
        >
          Entrar com Google
        </Button>

        <Link href="/" className="text-sm text-center">
          Acessar sem fazer login
        </Link>
      </div>
    </Modals>
  );
}
