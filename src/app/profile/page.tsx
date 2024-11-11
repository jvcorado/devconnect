"use client";

import get from "@/api/get";
import Container from "@/components/container";
import ModalSm from "@/components/modal_sm";
import Post from "@/components/post";
import { useAuth } from "@/context/authContext";
import { Avatar } from "@nextui-org/avatar";
import { usePost } from "@/context/postContext";
import { Button } from "@nextui-org/button";
import Modals from "@/components/modalUI/modal";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/inputUI/inputUI";
import { useForm } from "react-hook-form";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Plus } from "lucide-react";
import update from "@/api/update";
import { Posts } from "../page";
import Stories from "stories-react";
import "stories-react/dist/index.css";
import { useMediaQuery } from "usehooks-ts";
import create from "@/api/create";
interface CloudinaryInfo {
  url: string;
}

interface Story {
  type: "image";
  url: string;
  duration: number;
}

const userSchema = z.object({
  name: z.string(),
  username: z.string(),
  bio: z.string(),
});

export type UserInputSchema = z.infer<typeof userSchema>;

export default function Profile() {
  const { post, aboutProfile } = usePost();
  const [openModal, setOpenModal] = useState(false);
  const { setUser, user } = useAuth();
  const [urlImage, setUrl] = useState<CloudinaryInfo | null>(null);
  const [openStorys, setOpenStorys] = useState(false);
  const [storysFeed, setStorysFeeds] = useState<Story[]>([]);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const getStorys = async () => {
    const response = await get("post/list-all");
    const postsWithImages = response.data.filter(
      (item: Posts) => item.content === "feed" && item.image_url !== ""
    );

    const storyData: Story[] = postsWithImages.map((post: Posts) => ({
      type: "image",
      url: post.image_url,
      duration: 5000, // Define a duration padrão ou personalize conforme necessário
    }));

    return setStorysFeeds(storyData);
  };
  const handleRefresh: () => Promise<void> = async () => {
    await getStorys();
  };

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<UserInputSchema>({
    resolver: zodResolver(userSchema),
  });

  const uploadImg = async () => {
    let body = {};

    body = {
      user_id: Number(user?.id) ?? 0,
      content: "feed",
      image_url: urlImage?.url ?? "",
      likes: 0,
      shares: 0,
    };

    console.log(body);

    const response = await create({ path: "post/create", body });

    if (response.status === 200 || response.status === 201) {
      reset({});
      getStorys();
    } else {
      console.log("Story not created");
    }
  };

  const onSubmit = async () => {
    let body = {};

    body = {
      id: Number(user?.id),
      email: user?.email,
      name: watch("name"),
      username: watch("username"),
      bio: watch("bio"),
      avatar_url: urlImage?.url ?? user?.avatar_url,
    };

    const response = await update({ path: "user/update", body });

    if (response.status === 200 || response.status === 201) {
      reset({});
      setUser(response.data);
      setOpenModal(false);
    } else {
      console.log("User not created");
    }
  };

  useEffect(() => {
    if (urlImage) {
      uploadImg();
    }
  }, [urlImage]);

  useEffect(() => {
    if (openStorys) {
      getStorys();
    }
  }, [openStorys]);

  useEffect(() => {
    reset({
      name: user?.name,
      username: user?.username,
      bio: user?.bio,
    });
  }, [user]);

  const modal = () => {
    return (
      <Modals isOpen={openModal} onOpenChange={() => setOpenModal(false)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(() => onSubmit())();
          }}
          className="flex flex-col gap-5 items-center pt-20 p-10 text-white "
        >
          <CldUploadWidget
            uploadPreset="devconnect"
            onSuccess={(results: CloudinaryUploadWidgetResults) => {
              if (results.info) {
                const info: CloudinaryInfo =
                  typeof results.info === "string"
                    ? { url: results.info } // If `info` is a string, wrap it in an object
                    : results.info; // Otherwise, use the object directly
                setUrl(info || null); // Set the CloudinaryInfo object
              }
            }}
          >
            {({ open }) => (
              <Avatar
                onClick={() => open()}
                size="lg"
                src={urlImage?.url ?? user?.avatar_url}
              />
            )}
          </CldUploadWidget>

          <FormInput
            name="name"
            label="Name"
            type="text"
            placeholder="Enter your name"
            control={control as never}
            error={errors as never}
          />

          <FormInput
            name="username"
            label="Username"
            type="text"
            placeholder="Enter your username"
            control={control as never}
            error={errors as never}
          />

          <FormInput
            name="bio"
            label="Biografia"
            type="text"
            placeholder="Enter your biografia"
            control={control as never}
            error={errors as never}
          />

          <Button
            type="submit"
            color="default"
            size="lg"
            className="text-white w-full"
          >
            {isSubmitting ? <p className="loader">.</p> : "Edit"}
          </Button>
        </form>
      </Modals>
    );
  };

  const storys = () => {
    return (
      <Modals
        size={isDesktop ? "2xl" : "full"}
        isOpen={openStorys}
        onOpenChange={() => setOpenStorys(false)}
      >
        {isDesktop ? (
          <div className="!overflow-x-hidden mx-auto flex items-center justify-center">
            <Stories width="400px" height="600px" stories={storysFeed} />
          </div>
        ) : (
          <div className="!overflow-x-hidden ">
            <Stories width="100vw" height="100vh" stories={storysFeed} />
          </div>
        )}
      </Modals>
    );
  };

  if (openStorys) {
    return storys();
  }

  return (
    <div className="flex flex-col gap-2 md:gap-3 relative ">
      <ModalSm>
        <div className="flex flex-col gap-2 w-full">
          <div className=" flex gap-1 justify-between ">
            <div className="flex gap-1 items-center">
              <CldUploadWidget
                uploadPreset="devconnect"
                onSuccess={(results: CloudinaryUploadWidgetResults) => {
                  if (results.info) {
                    const info: CloudinaryInfo =
                      typeof results.info === "string"
                        ? { url: results.info } // Se `info` for uma string, envolve em um objeto
                        : results.info; // Caso contrário, use o objeto diretamente
                    setUrl(info || null); // Define o objeto CloudinaryInfo
                  }
                }}
              >
                {({ open }) => (
                  <div className="relative">
                    <Avatar
                      onClick={() => setOpenStorys(true)}
                      size="lg"
                      src={user?.avatar_url}
                    />
                    <Plus
                      size={24}
                      onClick={() => open()}
                      color="white"
                      className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer"
                    />
                  </div>
                )}
              </CldUploadWidget>

              <div className="flex flex-col gap-1 items-start justify-center ps-4">
                <h4 className="text-small font-semibold leading-none text-[#ffffff]">
                  {user?.name}
                </h4>
                <h5 className="text-small tracking-tight text-[#ffffff8e]">
                  {user?.bio ? user?.bio : "Cadastre sua biografia"}
                </h5>
              </div>
            </div>
          </div>

          <div className="  flex items-center justify-center gap-5 w-full text-white">
            <div className="flex flex-col gap-1 items-center">
              <p className="font-semibold">{aboutProfile.publications}</p>
              <p>posts </p>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <p className="font-semibold">{aboutProfile.followers}</p>
              <p>followers </p>
            </div>
            <div className="flex flex-col gap-1 items-center">
              <p className="font-semibold">{aboutProfile.following}</p>
              <p>following </p>
            </div>
          </div>

          <Button
            onPress={() => setOpenModal(true)}
            color="primary"
            className=" text-white p-3 rounded-xl font-semibold  me-5 mb-2"
          >
            Edit
          </Button>
        </div>
      </ModalSm>

      <Container handleRefresh={handleRefresh}>
        <div className="flex flex-col md:gap-3 ">
          {post
            .slice()
            .reverse()
            .map((post) => (
              <Post key={post.id} item={post} />
            ))}
        </div>
      </Container>

      {openModal && modal()}
    </div>
  );
}
