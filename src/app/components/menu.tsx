"use client";

import { Button } from "@nextui-org/button";
import { HeartIcon, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

export default function Menu() {
  const [isLike, setIsLike] = useState(false);
  const [isComment, setIsComment] = useState(false);

  return (
    <footer className="flex items-center bg-[#0A0A0A] justify-between fixed bottom-0   w-full px-5 py-3">
      <Button
        onClick={() => setIsLike(!isLike)}
        isIconOnly
        color="default"
        size="sm"
        aria-label="Like"
      >
        <HeartIcon color={isLike ? "#ffffff" : "#acacac"} size={44} />
      </Button>
      <Button
        onClick={() => setIsComment(!isComment)}
        isIconOnly
        color="default"
        size="sm"
        aria-label="Like"
      >
        <MessageCircle color={isComment ? "#b8b8b8" : "#acacac"} size={44} />
      </Button>
      <Button isIconOnly color="default" size="sm" aria-label="Like">
        <Send color={"#acacac"} size={44} />
      </Button>
      <Button isIconOnly color="default" size="sm" aria-label="Like">
        <Send color={"#acacac"} size={44} />
      </Button>
      <Button isIconOnly color="default" size="sm" aria-label="Like">
        <Send color={"#acacac"} size={44} />
      </Button>
    </footer>
  );
}
