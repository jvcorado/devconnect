/* "use client";

import { Avatar } from "@nextui-org/avatar";

import { Button } from "@nextui-org/button";

import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import { Plus } from "lucide-react";

import { Posts } from "../page";
import Stories from "stories-react";
import "stories-react/dist/index.css";
import { useMediaQuery } from "usehooks-ts";
import { usePost } from "@/src/context/postContext";
import Post from "@/src/components/post";
import ModalSm from "@/src/components/modal_sm";
import Container from "@/src/components/container";
import Modals from "@/src/components/modalUI/modal";
import FormInput from "@/src/components/inputUI/inputUI";
import { useSession } from "next-auth/react";

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
  const [urlImage, setUrl] = useState<CloudinaryInfo | null>(null);
  const { data: session } = useSession();
  const user = session?.user;
  const [openStorys, setOpenStorys] = useState(false);
  const [storysFeed, setStorysFeeds] = useState<Story[]>([]);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<UserInputSchema>({
    resolver: zodResolver(userSchema),
  }); */

/*   const getStorys = async () => {
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
  }; */

/*   const uploadImg = async () => {
    let body = {};

    body = {
      user_id: Number(user?.id) ?? 0,
      content: "feed",
      image_url: urlImage?.url ?? "",
      likes: 0,
      shares: 0,
    };

    const response = await create({ path: "post/create", body });

    if (response.status === 200 || response.status === 201) {
      reset({});
      getStorys();
    } else {
      console.log("Story not created");
    }
  }; */

/* const onSubmit = async () => {
  if (!user?.id || !user?.email) {
    console.log("Usuário inválido. ID ou email ausente.");
    return;
  }

  const body = {
    id: Number(user.id),
    email: user.email,
    name: watch("name"),
    username: watch("username"),
    bio: watch("bio"),
    avatar_url: urlImage?.url ?? user.avatar_url,
  };

  const response = await update({ path: "user/update", body });

  if (response.status === 200 || response.status === 201) {
    reset();
    setUser(response.data); // certifique-se que setUser está vindo de algum hook/contexto
    setOpenModal(false);
  } else {
    console.error("Erro ao atualizar usuário");
  }
};
 */
/*   useEffect(() => {
    if (urlImage) {
      uploadImg();
    }
  }, [urlImage]); */

/*  useEffect(() => {
    if (openStorys) {
      getStorys();
    }
  }, [openStorys]); */

/*  useEffect(() => {
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

      <Container>
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
 */

"use client";

import { useSession } from "next-auth/react";
import { Avatar } from "@nextui-org/avatar";
import { usePost } from "@/src/context/postContext";
import Post from "@/src/components/post";
import Container from "@/src/components/container";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const { post, aboutProfile } = usePost();

  const userPosts = post.filter((p) => p.user_id === user?.id);

  return (
    <div className="flex flex-col gap-4 md:gap-6 relative px-4 py-6">
      {/* Header com avatar, nome e bio */}
      <div className="flex items-center gap-4">
        <Avatar
          size="lg"
          isBordered
          radius="full"
          src={user?.avatar_url || user?.image || ""}
        />
        <div className="flex flex-col gap-1 text-white">
          <h2 className="text-lg font-semibold">{user?.name}</h2>
          <p className="text-sm text-[#ffffff8e]">
            {user?.bio ?? "Nenhuma biografia cadastrada"}
          </p>
        </div>
      </div>

      {/* Contadores */}
      <div className="flex justify-around text-white text-center">
        <div>
          <p className="font-bold text-lg">{userPosts.length}</p>
          <p className="text-sm">Posts</p>
        </div>
        <div>
          <p className="font-bold text-lg">{aboutProfile.followers}</p>
          <p className="text-sm">Followers</p>
        </div>
        <div>
          <p className="font-bold text-lg">{aboutProfile.following}</p>
          <p className="text-sm">Following</p>
        </div>
      </div>

      {/* Lista de posts */}
      <Container>
        <div className="flex flex-col gap-4">
          {userPosts.length > 0 ? (
            userPosts
              .slice()
              .reverse()
              .map((post) => <Post key={post.id} item={post} />)
          ) : (
            <p className="text-center text-white mt-4">
              Nenhuma publicação feita ainda.
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
