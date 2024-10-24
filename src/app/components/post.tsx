"use client";

import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { HeartIcon, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@nextui-org/input";
import { useMediaQuery } from "usehooks-ts";
import {
  SwipeableList,
  SwipeableListItem,
  /*   SwipeAction,
  TrailingActions, */
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { Posts } from "../page";

export default function Post({ item }: { item: Posts }) {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isComment, setIsComment] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  /* const deletePost = (id: number) => {
    setFeed((prevFeed: Posts[]) =>
      prevFeed.filter((post: Posts) => post.id !== id)
    );
  }; */

  /*  const trailingActions = () => {
    return (
      <div className="bg-[#CC3733] flex items-center justify-between p-3 rounded-lg">
        <TrailingActions>
          <SwipeAction destructive={true} onClick={() => {}}>
            Delete
          </SwipeAction>
        </TrailingActions>
      </div>
    );
  };
 */
  return (
    <SwipeableList key={item.id} className="flex flex-col">
      <SwipeableListItem className="mt-1" key={item.id}>
        <Card className="w-[100%] mx-auto !min-h-full !h-full bg-[#0A0A0A] lg:!bg-[#181818] !border-none !shadow-none px-3 ">
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar isBordered radius="full" size="md" src={item.image_url} />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-white">
                  {item.user_id}
                </h4>
              </div>
            </div>
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
          </CardHeader>
          <CardBody className="ps-[70px] py-0 text-small text-[#ffffff8e] overflow-y-hidden">
            <p>{item.content}</p>
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
