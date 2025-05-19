/* "use client";

import { Avatar } from "@nextui-org/avatar";
import { useEffect, useState } from "react";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";

import "stories-react/dist/index.css";
import { useMediaQuery } from "usehooks-ts";
import Stories from "stories-react";
import { Plus } from "lucide-react";

import { Posts } from "../app/page";
import get from "../api/get";
import create from "../api/create";
import Modals from "./modalUI/modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface CloudinaryInfo {
  url: string;
}

interface Story {
  type: "image";
  url: string;
  duration: number;
}

export default function StorysButton({
  size = "lg",
}: {
  size?: "lg" | "md" | "sm";
}) {
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;
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
      duration: 5000,
    }));

    setStorysFeeds(storyData);
  };

  const uploadImg = async () => {
    if (!user?.id) {
      return router.push("/login");
    }

    const body = {
      user_id: Number(user.id),
      content: "feed",
      image_url: urlImage?.url ?? "",
      likes: 0,
      shares: 0,
    };

    const response = await create({ path: "post/create", body });

    if (response.status === 200 || response.status === 201) {
      getStorys();
    } else {
      console.log("Story not created");
    }
  };

  useEffect(() => {
    if (urlImage) {
      uploadImg();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlImage]);

  useEffect(() => {
    if (openStorys) {
      getStorys();
    }
  }, [openStorys]);

  const storys = () => {
    return (
      <Modals
        size={isDesktop ? "2xl" : "full"}
        isOpen={openStorys}
        onOpenChange={() => setOpenStorys(false)}
      >
        <div
          className={`!overflow-x-hidden ${
            isDesktop ? "mx-auto flex items-center justify-center" : ""
          }`}
        >
          <Stories
            width={isDesktop ? "400px" : "100vw"}
            height={isDesktop ? "600px" : "100vh"}
            stories={storysFeed}
          />
        </div>
      </Modals>
    );
  };

  if (openStorys) {
    return storys();
  }

  return (
    <div>
      <CldUploadWidget
        uploadPreset="devconnect"
        onSuccess={(results: CloudinaryUploadWidgetResults) => {
          if (results.info) {
            const info: CloudinaryInfo =
              typeof results.info === "string"
                ? { url: results.info }
                : results.info;
            setUrl(info || null);
          }
        }}
      >
        {({ open }) => (
          <div className="relative">
            <Avatar
              onClick={() => setOpenStorys(true)}
              size={size}
              src={user?.avatar_url || user?.image || ""}
            />
            <Plus
              size={size === "lg" ? 24 : 20}
              onClick={() => {
                if (!user?.id) return router.push("/login");
                open();
              }}
              color="white"
              className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer"
            />
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
}
 */
