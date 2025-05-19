"use client";

import { Avatar } from "@nextui-org/avatar";
import { useMediaQuery } from "usehooks-ts";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const path = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;

  if (
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password"
  ) {
    return null;
  }

  return (
    <header
      className={`flex h-[60px] md:sticky md:top-0 z-50 items-center justify-between px-5 text-xl text-white ${
        isDesktop ? "bg-[#0A0A0A]" : "bg-transparent"
      }`}
    >
      <div className="loader"></div>

      {!user ? (
        <Button color="primary" onPress={() => router.push("/login")}>
          Sign In
        </Button>
      ) : (
        <Popover placement="right" color="secondary">
          <PopoverTrigger>
            <Button>
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={user?.avatar_url || user?.image || ""}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 flex flex-col gap-3">
              <div className="text-small font-bold">
                {user?.name || user?.username}
              </div>
              {user?.bio && <div className="text-tiny italic">{user.bio}</div>}
              <Button color="danger" onPress={() => signOut()}>
                Log out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </header>
  );
}
