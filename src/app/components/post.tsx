"use client";

import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { HeartIcon, MessageCircle, Send } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@nextui-org/input";

export default function Post() {
  const [isFollowed, setIsFollowed] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [isComment, setIsComment] = useState(false);

  return (
    <Card className="w-full !min-h-full !h-full !bg-[#181818] !border-none !shadow-none px-3">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src="https://nextui.org/avatars/avatar-1.png"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              Zoey Lang
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              @zoeylang
            </h5>
          </div>
        </div>
        <Button
          className={
            isFollowed
              ? "bg-transparent text-foreground border-default-200"
              : "bg-[#777777] text-[#ffffff] border-default-200"
          }
          radius="full"
          size="sm"
          variant={isFollowed ? "bordered" : "solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          {isFollowed ? "Unfollow" : "Follow"}
        </Button>
      </CardHeader>
      <CardBody className="ps-[70px] py-0 text-small text-default-400 overflow-y-hidden">
        <p>
          Frontend developer and UI/UX enthusiast. Join me on this coding
          adventure! Frontend developer and UI/UX enthusiast. Join me on this
          coding adventure! Frontend developer and UI/UX enthusiast. Join me on
          this coding adventure! Frontend developer and UI/UX enthusiast. Join
          me on this coding adventure! Frontend developer and UI/UX enthusiast.
          Join me on this coding adventure!
        </p>
        <span className="pt-2">
          #FrontendWithZoey
          <span className="py-2" aria-label="computer" role="img">
            💻
          </span>
        </span>
      </CardBody>
      <CardFooter className="gap-3 ps-[70px]">
        <Button
          onClick={() => setIsLike(!isLike)}
          isIconOnly
          color="default"
          size="sm"
          aria-label="Like"
        >
          <HeartIcon color={isLike ? "#ffffff" : "#777777"} size={24} />
        </Button>
        <Button
          onClick={() => setIsComment(!isComment)}
          isIconOnly
          color="default"
          size="sm"
          aria-label="Like"
        >
          <MessageCircle color={isComment ? "#ffffff" : "#777777"} size={24} />
        </Button>
        <Button isIconOnly color="default" size="sm" aria-label="Like">
          <Send color={"#777777"} size={24} />
        </Button>
      </CardFooter>
      <div className="ps-[70px] pe-3 pb-3">
        {isComment && (
          <Textarea
            label="Description"
            placeholder="Enter your description"
            defaultValue="NextUI is a React UI library that provides a set of accessible, reusable, and beautiful components."
            className="w-full"
          />
        )}
      </div>
    </Card>
  );
}

{
  /* <div className="flex flex-col gap-3  py-3 px-5 border-b border-[#404040]">
      <header className=" flex items-center justify-between  ">
        <div className="flex gap-3 ">
          <Avatar
            isBordered
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
          />
          <div className="flex items-center gap-1">
            <h1 className="font-bold">User123</h1>
            <p className="text-[#777777]">24h</p>
          </div>
        </div>
        <Ellipsis size={24} className="text-[#777777]" />
      </header>
      <div className="flex flex-col gap-3 ps-[53px]">
        <h1 className="font-bold">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum,
          sunt.
        </h1>
        <p>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum,
          exercitationem? Consequatur sit, veniam architecto perferendis minus
          expedita facere quia quaerat consectetur rerum ducimus aliquid,
          distinctio amet nostrum! Cupiditate, rem animi!
        </p>
        <div className="flex gap-3 items-center">
          <Button isIconOnly color="default" size="sm" aria-label="Like">
            <HeartIcon color="#777777" size={24} />
          </Button>
          <Button isIconOnly color="default" size="sm" aria-label="Like">
            <MessageCircle color="#777777" size={24} />
          </Button>
          <Button isIconOnly color="default" size="sm" aria-label="Like">
            <Send color="#777777" size={24} />
          </Button>
        </div>
      </div>
    </div> */
}
