import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn } = useUser();
  const isDesktop = window.innerWidth > 1024;

  if (!isSignedIn || isDesktop) {
    return (
      <header
        className={` flex h-[60px] lg:sticky lg:top-0 lg:z-50 items-center justify-between px-5  text-xl  text-white`}
      >
        <p>D</p>

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
}
