"use client";

import { Button } from "@nextui-org/button";
import { CirclePlus } from "lucide-react";
import { useEffect, useRef } from "react";
import { Textarea } from "@nextui-org/input";
import create from "../api/create";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Avatar } from "@nextui-org/avatar";
import { useAuth } from "../context/authContext";
import { Posts } from "../page";

/* interface Posts {
  user_id: number;
  content: string;
  image_url: string;
  likes: number;
  shares: number;
}
 */

const postsSchema = z.object({
  user_id: z.number().int().nonnegative(),
  content: z.string().min(1, "Content cannot be empty"),
  image_url: z.string().url("Invalid URL format"),
  likes: z.number().int().nonnegative(),
  shares: z.number().int().nonnegative(),
});

export type PostsInputSchema = z.infer<typeof postsSchema>;

export default function NewPost({
  newPost,
  setNewPost,
  setFeed,
}: {
  setFeed: (update: Posts[] | ((prevFeed: Posts[]) => Posts[])) => void;
  newPost: boolean;
  setNewPost: (value: boolean) => void;
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useAuth();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm<PostsInputSchema>({ resolver: zodResolver(postsSchema) });

  const onSubmit = async () => {
    const post = watch("content");

    const body = {
      user_id: user?.id ?? 0, // fallback se user.id for indefinido
      content: post,
      image_url:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      likes: 1,
      shares: 0,
    };

    const response = await create({ path: "post/create", body });

    if (response.status === 200 || response.status === 201) {
      reset({});
      setFeed((prevFeed: Posts[]) => [...prevFeed, response.data]);

      console.log("Post created successfully");
    } else {
      console.log("Failed to create post");
    }

    setNewPost(false);
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      return onSubmit();
    }
  };

  const handleKeyDownEsc = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && !event.shiftKey) {
      setNewPost(false);
    }
  };

  const writePost = () => (
    <Controller
      control={control}
      name="content"
      render={({ field }) => (
        <Textarea
          {...field}
          errorMessage={errors.content?.message}
          variant="bordered"
          color="secondary"
          ref={inputRef}
          onKeyDown={(event) => {
            handleKeyDown(event);
            handleKeyDownEsc(event);
          }}
          label=""
          placeholder="Enter your post"
          defaultValue=""
          className="w-[100%] mx-auto text-white"
          autoFocus
        />
      )}
    />
  );

  useEffect(() => {
    if (newPost && inputRef.current) {
      inputRef.current.focus();
    }
  }, [newPost]);

  return (
    <>
      <div
        onKeyDown={handleKeyDownEsc}
        className={`w-full py-2 rounded-2xl flex items-start bg-[#181818]  ${
          newPost ? "ps-5 " : "ps-5"
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(() => onSubmit())();
          }}
          className="flex gap-5 items-center"
        >
          <Avatar src={user?.avatar_url} />
          <div className="flex flex-col gap-1 items-start justify-center ps-4">
            <h4 className="text-small font-semibold leading-none text-[#ffffff]">
              {user?.username}
            </h4>
            <h5 className="text-small tracking-tight text-[#ffffff8e]">
              Write your post
            </h5>
          </div>
        </form>

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
