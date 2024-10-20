"use client";

import { Button } from "@nextui-org/button";
import { CirclePlus } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@nextui-org/input";
import { Posts } from "../page";

export default function NewPost({
  newPost,
  setNewPost,
  setFeed,
}: {
  newPost: boolean;
  setFeed: (update: Posts[] | ((prevFeed: Posts[]) => Posts[])) => void;
  setNewPost: (value: boolean) => void;
}) {
  const { user, isSignedIn } = useUser();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [post, setPost] = useState<Posts>({
    id: "",
    image: "",
    user: "",
    title: "",
  });

  const createPost = () => {
    const newPostWithId: Posts = { ...post, id: uuidv4() };
    setFeed((prevFeed: Posts[]) => [newPostWithId, ...prevFeed]);
    setPost({
      id: "",
      image: "",
      user: user?.fullName ?? "",
      title: "",
    });
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
      defaultValue={post.title}
      className="w-[100%] mx-auto text-white"
      autoFocus
      onChange={(e) =>
        setPost((prevPost) => ({
          ...prevPost,
          image: user?.imageUrl ?? "",
          user: user?.fullName ?? "",
          title: e.target.value,
        }))
      }
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
