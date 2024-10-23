"use client";

import { Button } from "@nextui-org/button";
import { CirclePlus } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { Textarea } from "@nextui-org/input";
import create from "../api/create";

/* interface Posts {
  user_id: number;
  content: string;
  image_url: string;
  likes: number;
  shares: number;
}
 */
export default function NewPost({
  newPost,
  setNewPost,
}: {
  newPost: boolean;
  setNewPost: (value: boolean) => void;
}) {
  const { user, isSignedIn } = useUser();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const createPost = async () => {
    let body = {};
    body = {
      user_id: 1,
      content: "Compartilhando nosso primeiro post! na aplicação",
      image_url:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      likes: 0,
      shares: 0,
    };

    const response = await create({ path: "post/create", body });

    if (response.status === 200 || response.status === 201) {
      console.log("Post created successfully");
    } else console.log("Failed to create post");

    setNewPost(false);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      return createPost();
    }
  };

  const writePost = () => (
    <Textarea
      variant="bordered"
      color="secondary"
      ref={inputRef}
      onKeyDown={handleKeyDown}
      label=""
      placeholder="Enter your post"
      defaultValue={""}
      className="w-[100%] mx-auto text-white"
      autoFocus
    />
  );

  useEffect(() => {
    if (newPost && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newPost]);

  if (isSignedIn) {
    return (
      <>
        <div
          className={`w-full py-2 rounded-2xl flex items-start bg-[#181818]  ${
            newPost ? "ps-5 " : "ps-5"
          }`}
        >
          <div className="flex gap-5 items-center">
            <UserButton />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-[#ffffff]">
                {user?.fullName}
              </h4>
              <h5 className="text-small tracking-tight text-[#ffffff8e]">
                Write your post
              </h5>
            </div>
          </div>

          <Button
            onPress={() => {
              setNewPost(!newPost);
            }}
            onClick={focusInput}
            color="secondary"
            className="ml-auto self-start"
          >
            <CirclePlus color="#336AEA" size={44} />
          </Button>
        </div>
        {newPost && writePost()}
      </>
    );
  }

  return null;
}
