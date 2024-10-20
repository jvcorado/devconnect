import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useMediaQuery } from "usehooks-ts";

export default function Header() {
  const { isSignedIn } = useUser();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  if (!isSignedIn || isDesktop) {
    return (
      <header
        className={` flex h-[60px] lg:sticky lg:top-0 lg:z-50 items-center justify-between px-5  text-xl  text-white`}
      >
        <div className="loader"></div>

        <SignedOut>
          <SignInButton mode="modal">
            <div className="px-4 text-base py-1 cursor-pointer bg-white  rounded-lg flex text-[#777777] items-center  justify-center">
              Login
            </div>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    );
  }

  return (
    <header
      className={` flex h-[60px] sticky top-0 bg-[#0A0A0A] w-full z-50 items-center justify-center text-xl  text-white`}
    >
      <div className="loader"></div>
    </header>
  );
}
