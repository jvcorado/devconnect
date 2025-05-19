"use client";

import { CircleUserRound, HeartIcon, House, Plus, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePost } from "../context/postContext";
import { useSession } from "next-auth/react";

export default function Menu() {
  const path = usePathname();
  const router = useRouter();
  const { setOpenModal } = usePost();
  const { data: session } = useSession();

  const user = session?.user;

  if (
    path === "/login" ||
    path === "/register" ||
    path === "/forgot-password"
  ) {
    return null;
  }

  const getColor = (route: string) => (path === route ? "#FFFFFF" : "#acacac");

  return (
    <footer className="z-50 flex left-10 h-[60px] items-center md:fixed md:left-3 md:top-0 md:w-[60px]  md:h-[40%] md:bg-[#181818] md:my-auto md:flex-col rounded-2xl bg-[#181818] justify-between fixed bottom-3 w-[80%] mx-auto px-5 py-3">
      <Link href={"/"}>
        <House color={getColor("/")} size={32} />
      </Link>

      <Link href={"/search"}>
        <Search color={getColor("/search")} size={32} />
      </Link>

      <Link
        href={"/"}
        onClick={(e) => {
          e.preventDefault();
          if (user) {
            setOpenModal(true);
          } else {
            router.push("/login");
          }
        }}
        className="!bg-[#292929] w-[50px] h-[50px] rounded-lg flex items-center justify-center"
      >
        <Plus color={"#FFFFFF"} size={32} />
      </Link>

      <Link href={"/favorites"}>
        <HeartIcon color={getColor("/favorites")} size={32} />
      </Link>

      <Link
        href={user ? "/profile" : "/login"}
        onClick={(e) => {
          if (!user) {
            e.preventDefault();
            router.push("/login");
          }
        }}
      >
        <CircleUserRound color={getColor("/profile")} size={32} />
      </Link>
    </footer>
  );
}
