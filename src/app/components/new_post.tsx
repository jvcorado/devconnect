"use client";

import { Button } from "@nextui-org/button";
import { CirclePlus } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { Textarea } from "@nextui-org/input";
import create from "../api/create";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

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
}: {
  newPost: boolean;
  setNewPost: (value: boolean) => void;
}) {
  const { user, isSignedIn } = useUser();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<PostsInputSchema>({ resolver: zodResolver(postsSchema) });

  const onSubmit = async () => {
    const post = watch("content");

    let body = {};
    body = {
      user_id: 1,
      content: post,
      image_url:
        "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
      likes: 0,
      shares: 0,
    };

    console.log(body);

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

  console.log(watch("content"));

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      return onSubmit();
    }
  };

  const writePost = () => (
    <Controller
      control={control}
      name="content"
      render={({ field }) => (
        <Textarea
          {...field}
          variant="bordered"
          color="secondary"
          ref={inputRef} // Corrigido de 'ref' para 'inputRef'
          onKeyDown={handleKeyDown}
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

  if (isSignedIn) {
    return (
      <>
        <div
          className={`w-full py-2 rounded-2xl flex items-start bg-[#181818]  ${
            newPost ? "ps-5 " : "ps-5"
          }`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit((data) => onSubmit(data))();
            }}
            className="flex gap-5 items-center"
          >
            <UserButton />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-[#ffffff]">
                {user?.fullName}
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

  return null;
}
