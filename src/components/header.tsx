"use client";

import { Avatar } from "@nextui-org/avatar";
import { useMediaQuery } from "usehooks-ts";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/popover";
import { Button } from "@nextui-org/button";
import { useAuth } from "@/context/authContext";
import { usePathname } from "next/navigation";

export default function Header() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const { user, logout, setOpenLogin } = useAuth();

  const path = usePathname();

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

      {user === null ? (
        <Button color="primary" onPress={() => setOpenLogin(true)}>
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
                src={user?.avatar_url}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 flex flex-col gap-3">
              <div className="text-small font-bold">{user?.name}</div>
              <div className="text-tiny italic">{user?.bio}</div>
              <Button color="danger" onPress={() => logout()}>
                Log out
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </header>
  );
}
