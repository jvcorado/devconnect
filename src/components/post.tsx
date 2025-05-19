"use client";

import {
  Avatar,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import { HeartIcon, MessageCircle, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { toast } from "sonner";
import TextareaInput from "./textArea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Posts } from "../app/page";
import { usePost } from "../context/postContext";
import create from "../app/api/create";

const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});

export type CommentInput = z.infer<typeof commentSchema>;

export default function Post({ item }: { item: Posts }) {
  const { data: session } = useSession();
  const { setNewPosts } = usePost();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm<CommentInput>({ resolver: zodResolver(commentSchema) });

  const currentUserId = session?.user?.id;

  const [isFollowed, setIsFollowed] = useState(item.followedByUser ?? false);
  const [isLike, setIsLike] = useState(item.likedByUser ?? false);
  const [likesCount, setLikesCount] = useState(item.likes);
  const [isComment, setIsComment] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const formattedDate = formatDistanceToNow(new Date(item.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  const handleLike = async () => {
    const newLikeState = !isLike;
    setIsLike(newLikeState);
    setLikesCount((prev) => prev + (newLikeState ? 1 : -1));

    try {
      const response = await fetch("/api/post/like", {
        method: newLikeState ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: item.id,
          user_id: currentUserId,
        }),
      });

      if (!response.ok) throw new Error();
    } catch (err) {
      setIsLike(!newLikeState);
      setLikesCount((prev) => prev - (newLikeState ? 1 : -1));
      toast.error("Erro ao atualizar like");
    }
  };

  const handleFollow = async () => {
    if (!currentUserId || !item.user_id) return;

    try {
      const response = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: currentUserId,
          followingId: item.user_id,
        }),
      });

      if (!response.ok) throw new Error();

      const result = await response.json();
      setIsFollowed(result.followed);
      toast.success(
        result.followed ? "Agora você está seguindo!" : "Você deixou de seguir."
      );
    } catch (err) {
      toast.error("Erro ao seguir/desseguir");
    }
  };

  const onSubmit = async () => {
    const content = watch("content");
    if (!content || !currentUserId) return;

    const body = {
      user_id: currentUserId,
      content,
      post_id: item.id,
    };

    const response = await create({ path: "comment/create", body });

    if (response.status === 200 || response.status === 201) {
      reset();
      setNewPosts(true);
      toast.success("Comentário criado com sucesso!");
    } else {
      toast.error("Falha ao criar comentário.");
    }

    setIsComment(false);
  };

  return (
    <Card className="w-full mx-auto bg-[#0A0A0A] md:bg-[#181818] border-none shadow-none px-3">
      <CardHeader className="justify-between">
        <div className="flex gap-5 items-center">
          <Avatar isBordered radius="full" size="md" src={item?.avatar_url} />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small capitalize leading-none text-white">
              {item?.username}
            </h4>
          </div>
        </div>

        {currentUserId !== item.user_id.toString() && (
          <Button
            className={
              isFollowed
                ? "bg-transparent text-foreground border-default-200"
                : "bg-[#313131] text-[#ffffff] border-default-200"
            }
            radius="full"
            size="sm"
            variant={isFollowed ? "bordered" : "solid"}
            onClick={handleFollow}
          >
            {isFollowed ? "Unfollow" : "Follow"}
          </Button>
        )}
      </CardHeader>

      <CardBody className="ps-[70px] py-0 text-small text-[#ffffff8e] overflow-y-hidden">
        {item.image_url && (
          <Image src={item.image_url} width={200} height={200} alt="image" />
        )}
        <p style={{ whiteSpace: "pre-line" }} className="mt-2">
          {item.content}
        </p>
      </CardBody>

      <CardFooter className="gap-3 ps-[70px] items-center">
        <Button
          onClick={handleLike}
          isIconOnly
          color={isDesktop ? "secondary" : "default"}
          size="sm"
          aria-label="Like"
        >
          <HeartIcon color={isLike ? "#ffffff" : "#acacac"} size={24} />
        </Button>
        <span className="text-xs text-[#aaa]">{likesCount}</span>

        <Button
          onClick={() => setIsComment(!isComment)}
          isIconOnly
          color={isDesktop ? "secondary" : "default"}
          size="sm"
          aria-label="Comment"
        >
          <MessageCircle color={isComment ? "#b8b8b8" : "#acacac"} size={24} />
        </Button>
        <Button isIconOnly color="default" size="sm" aria-label="Share">
          <Send color="#acacac" size={24} />
        </Button>
      </CardFooter>

      <h4 className="text-[11px] ps-[70px] leading-none text-[#ffffff8e]">
        {formattedDate}
      </h4>

      {isComment && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }}
          className="ps-[70px] pe-3 py-3"
        >
          <TextareaInput
            control={control as never}
            errorMessage={errors.content?.message}
            name="content"
            placeholder="Digite seu comentário"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) onSubmit();
              if (event.key === "Escape" && !event.shiftKey)
                setIsComment(false);
            }}
            onClose={() => setIsComment(false)}
            onSubmit={onSubmit}
          />
        </form>
      )}
    </Card>
  );
}
