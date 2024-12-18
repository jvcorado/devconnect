"use client";

import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { HeartIcon, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Textarea } from "@nextui-org/input";
import { useMediaQuery } from "usehooks-ts";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import get from "@/api/get";
import { Posts } from "@/app/page";
import deletion from "@/api/delete";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import { usePost } from "@/context/postContext";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  password: string;
  bio: string;
  avatar_url: string;
  user_id: number;
}

export default function Post({ item }: { item: Posts }) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLike, setIsLike] = useState(item.likes > 0 ? true : false);
  const [isComment, setIsComment] = useState(false);
  const [userData, setUserData] = useState<User[]>([]);
  const [userFiltered, setUserFiltered] = useState<User[]>([]);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const formattedDate = formatDistanceToNow(new Date(item.created_at), {
    addSuffix: true,
    locale: ptBR, // Definindo o locale para português
  });

  const { user } = useAuth();
  const { setNewPosts } = usePost();

  const id_user = Number(user?.id);

  const getUserData = async () => {
    const response = await get("user/list-all");
    setUserData(response.data ?? []);
  };

  const filterUserData = (id: number) => {
    const data = userData.filter((user: User) => user.id === id);
    return setUserFiltered(data);
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData.length > 0) {
      filterUserData(item.user_id);
    }
  }, [userData, item.user_id]);

  const deletePost = async ({
    id,
    user_id,
  }: {
    id: number;
    user_id: number;
  }) => {
    if (id_user === user_id) {
      try {
        const response = await deletion({ path: `post/delete/${id}` });

        if (response.status === 200 || response.status === 201) {
          console.log("Post deleted successfully");
          setNewPosts(true);
        } else {
          console.log("Post not deleted");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const trailingActions = ({
    id,
    user_id,
  }: {
    id: number;
    user_id: number;
  }) => {
    if (id_user === user_id) {
      return (
        <div className="bg-[#CC3733] flex items-center justify-between p-3 rounded-lg">
          <TrailingActions>
            <SwipeAction
              destructive={true}
              onClick={() => deletePost({ id, user_id })}
            >
              Delete
            </SwipeAction>
          </TrailingActions>
        </div>
      );
    }
  };

  return (
    <SwipeableList key={item.id} className="flex flex-col">
      <SwipeableListItem
        className="mt-1"
        key={item.id}
        trailingActions={trailingActions(item)}
      >
        <Card className="w-[100%] mx-auto !min-h-full !h-full bg-[#0A0A0A] md:!bg-[#181818] !border-none !shadow-none px-3 ">
          <CardHeader className="justify-between">
            <div className="flex gap-5 items-center ">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={userFiltered[0]?.avatar_url}
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small capitalize  leading-none text-white">
                  {userFiltered[0]?.username}
                </h4>
              </div>
            </div>

            {id_user !== item.user_id && (
              <Button
                className={
                  isFollowed
                    ? "bg-transparent text-foreground border-default-200"
                    : "bg-[#313131] text-[#ffffff] border-default-200"
                }
                radius="full"
                size="sm"
                variant={isFollowed ? "bordered" : "solid"}
                onPress={() => setIsFollowed(!isFollowed)}
              >
                {isFollowed ? "Unfollow" : "Follow"}
              </Button>
            )}
          </CardHeader>
          <CardBody className="ps-[70px] py-0 text-small text-[#ffffff8e] overflow-y-hidden">
            {item.image_url && (
              <Image src={item.image_url} width={200} height={200} alt="" />
            )}
            <p style={{ whiteSpace: "pre-line" }} className="mt-2">
              {item.content}
            </p>
          </CardBody>

          <CardFooter className="gap-3 ps-[70px]">
            <Button
              onClick={() => setIsLike(!isLike)}
              isIconOnly
              color={isDesktop ? "secondary" : "default"}
              size="sm"
              aria-label="Like"
            >
              <HeartIcon color={isLike ? "#ffffff" : "#acacac"} size={24} />
              {/*  <p>{item.likes}</p> */}
            </Button>
            <Button
              onClick={() => setIsComment(!isComment)}
              isIconOnly
              color={isDesktop ? "secondary" : "default"}
              size="sm"
              aria-label="Comment"
            >
              <MessageCircle
                color={isComment ? "#b8b8b8" : "#acacac"}
                size={24}
              />
            </Button>
            <Button
              isIconOnly
              color={isDesktop ? "secondary" : "default"}
              size="sm"
              aria-label="Like"
            >
              <Send color={"#acacac"} size={24} />
              {/*  <p>{item.shares}</p> */}
            </Button>
          </CardFooter>
          <h4 className="text-[11px] ps-[70px] leading-none text-[#ffffff8e]">
            {formattedDate}
          </h4>
          <div className="ps-[70px] pe-3 pb-3">
            {isComment && (
              <Textarea
                variant="bordered"
                color={isDesktop ? "secondary" : "default"}
                label=""
                placeholder="Enter your comment"
                className="w-[100%] mx-auto text-white"
                autoFocus
              />
            )}
          </div>
        </Card>
      </SwipeableListItem>
    </SwipeableList>
  );
}
