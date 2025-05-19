"use client";

import { Button } from "@nextui-org/button";
import { CirclePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMediaQuery } from "usehooks-ts";
import { toast } from "sonner";
import TextareaInput from "./textArea";
import { useForm } from "react-hook-form";
/* import StorysButton from "./storys"; */
import { Posts } from "../app/page";
import { usePost } from "../context/postContext";
import ModalSm from "./modal_sm";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import create from "../app/api/create";

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

  const { data: session } = useSession();
  const router = useRouter();
  const { setNewPosts, openModal, setOpenModal } = usePost();
  const [urlImage, setUrl] = useState<CloudinaryInfo | null>(null);

  console.log("data", session);

  const isDesktop = useMediaQuery("min-width: 1024px");

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm<PostsInputSchema>({ resolver: zodResolver(postsSchema) });

  const onSubmit = async () => {
    const post = watch("content");

    if (!post || post.trim() === "") {
      console.log("Content cannot be empty");
      return;
    }

    const body = {
      user_id: session?.user?.id ?? null,
      content: post,
      image_url: urlImage?.url ?? "",
      likes: 0,
      shares: 0,
    };

    console.log("body", body);

    const response = await create({ path: "post/create", body });

    if (response.status === 200 || response.status === 201) {
      reset({});
      setNewPosts(true);
      setUrl(null);
      setFeed((prevFeed: Posts[]) => [...prevFeed, response.data]);
      toast.success("Post created successfully", {
        position: "top-right",
      });
    } else {
      toast.error("Failed to create post", {
        position: "top-right",
      });
    }

    setOpenModal(false);
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      return onSubmit();
    }
  };

  const handleKeyDownEsc = (event: React.KeyboardEvent) => {
    if (event.key === "Escape" && !event.shiftKey && isDesktop) {
      setOpenModal(false);
    }
  };

  const writePost = () => (
    <div className="flex flex-col gap-3">
      <TextareaInput
        control={control as never}
        name="content"
        errorMessage={errors.content?.message}
        placeholder="Enter your post"
        onKeyDown={(event) => {
          handleKeyDown(event);
          handleKeyDownEsc(event);
        }}
        isUpload
        setUrl={setUrl}
        urlImage={urlImage}
        onClose={() => {
          setOpenModal(false);
          reset({ content: "" });
          setUrl(null);
        }}
        onSubmit={onSubmit}
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
          {/*  <StorysButton size="md" />
           */}
          <div className="flex flex-col gap-1 items-start justify-center ps-4">
            <h4 className="text-small font-semibold leading-none text-[#ffffff]">
              {session?.user?.username || session?.user?.name}
            </h4>
            <h5 className="text-small tracking-tight text-[#ffffff8e]">
              Write your post
            </h5>
          </div>
        </form>

        <Button
          onPress={() => {
            if (!session?.user?.id) {
              return router.push("/login");
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

      <div className="pt-3 md:pt-0 w-[calc(100%_-_36px)] md:max-w-[60%] lg:max-w-[30%] flex flex-col gap-3 mx-auto">
        {openModal && writePost()}
      </div>
    </>
  );
}
