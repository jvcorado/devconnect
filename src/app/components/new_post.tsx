"use client";

import { Button } from "@nextui-org/button";
import { CirclePlus } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";

export default function NewPost({
  newPost,
  setNewPost,
}: {
  newPost: boolean;
  setNewPost: (value: boolean) => void;
}) {
  const { user, isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <div
        className={`w-full py-2 rounded-2xl flex items-start bg-[#181818] ${
          newPost ? "ps-5 " : "ps-5"
        }`}
      >
        <div className="flex gap-5 items-center">
          <UserButton />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {user?.fullName}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @zoeylang
            </h5>
          </div>
        </div>

        <Button
          onPress={() => {
            console.log("Button clicked");
            setNewPost(!newPost);
          }}
          className="ml-auto self-start"
        >
          <CirclePlus color="#336AEA" size={44} />
        </Button>
      </div>
    );
  }

  return <></>;
}
