"use client";

import { useAuth } from "@/context/authContext";
import { usePost } from "@/context/postContext";
import { CircleUserRound, HeartIcon, House, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Menu() {
  const path = usePathname();
  const { setOpenModal } = usePost();
  const { user, setOpenLogin } = useAuth();

  if (
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password"
  ) {
    return null;
  }

  const getColor = (route: string) => (path === route ? "#FFFFFF" : "#acacac");

  return (
    <footer className=" z-50 flex items-center md:fixed md:left-3 md:top-0 md:w-[60px]  md:h-[40%] md:bg-[#181818] md:my-auto md:flex-col rounded-2xl bg-[#181818] justify-between fixed bottom-3 w-[80%] left-14 mx-auto px-5 py-3">
      <Link href={"/"}>
        <House color={getColor("/")} size={32} />
      </Link>

      <Link href={"/search"}>
        <Search color={getColor("/search")} size={32} />
      </Link>

      <Link
        onClick={user ? () => setOpenModal(true) : () => setOpenLogin(true)}
        href={"/"}
        className="!bg-[#292929] w-[50px] h-[50px] rounded-lg flex items-center justify-center"
      >
        <Plus color={getColor("/plus")} size={32} />
      </Link>

      <Link href={"/favorites"}>
        <HeartIcon color={getColor("/favorites")} size={32} />
      </Link>

      <Link
        href={user ? "/profile" : "/"}
        onClick={user === null ? () => setOpenLogin(true) : undefined}
      >
        <CircleUserRound color={getColor("/profile")} size={32} />
      </Link>
    </footer>
  );
}
