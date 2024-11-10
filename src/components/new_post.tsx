"use client";

import { Button } from "@nextui-org/button";
import { CirclePlus, ImagePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "@nextui-org/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Avatar } from "@nextui-org/avatar";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

import { Posts } from "@/app/page";
import { useAuth } from "@/context/authContext";
import create from "@/api/create";
import ModalSm from "./modal_sm";
import { usePost } from "@/context/postContext";
import Image from "next/image";

interface CloudinaryInfo {
  url: string;
}

const postsSchema = z.object({
  user_id: z.number().int().nonnegative(),
  content: z.string().min(1, "Content cannot be empty"),
  image_url: z.string().url("Invalid URL format"),
  likes: z.number().int().nonnegative(),
  shares: z.number().int().nonnegative(),
});

export type PostsInputSchema = z.infer<typeof postsSchema>;

export default function NewPost({
  setFeed,
}: {
  setFeed: (update: Posts[] | ((prevFeed: Posts[]) => Posts[])) => void;
}) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { user, setOpenLogin } = useAuth();
  const { setNewPosts, openModal, setOpenModal } = usePost();
  const [urlImage, setUrl] = useState<CloudinaryInfo | null>(null);

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
      user_id: Number(user?.id) ?? 0,
      content: post,
      image_url: urlImage?.url ?? "",
      likes: 1,
      shares: 0,
    };

    const response = await create({ path: "post/create", body });

    if (response.status === 200 || response.status === 201) {
      reset({});
      setNewPosts(true);
      setUrl(null);
      setFeed((prevFeed: Posts[]) => [...prevFeed, response.data]);
      console.log("Post created successfully");
    } else {
      console.log("Failed to create post");
    }

    setOpenModal(false);
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
      setOpenModal(false);
    }
  };

  const writePost = () => (
    <div className=" flex flex-col gap-3">
      {urlImage && <Image src={urlImage.url} width={200} height={200} alt="" />}

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
    </div>
  );

  useEffect(() => {
    if (openModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [openModal]);

  return (
    <>
      <ModalSm handleKeyDownEsc={handleKeyDownEsc}>
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

            <CldUploadWidget
              uploadPreset="devconnect"
              onSuccess={(results: CloudinaryUploadWidgetResults) => {
                if (results.info) {
                  const info: CloudinaryInfo =
                    typeof results.info === "string"
                      ? { url: results.info } // If `info` is a string, wrap it in an object
                      : results.info; // Otherwise, use the object directly
                  setUrl(info || null); // Set the CloudinaryInfo object
                  setOpenModal(!openModal);
                }
              }}
            >
              {({ open }) => (
                <ImagePlus onClick={() => open()} size={16} color="white" />
              )}
            </CldUploadWidget>
          </div>
        </form>

        <Button
          onPress={() => {
            if (user?.id === undefined || null) {
              return setOpenLogin(true);
            }

            setOpenModal(!openModal);
          }}
          onClick={focusInput}
          color="secondary"
          className="ml-auto self-start"
        >
          <CirclePlus color="#336AEA" size={44} />
        </Button>
      </ModalSm>
      <div className="pt-3  md:pt-0 w-[calc(100%_-_36px)] md:max-w-[60%] lg:max-w-[30%] flex flex-col gap-3 mx-auto">
        {openModal && writePost()}
      </div>
    </>
  );
}
