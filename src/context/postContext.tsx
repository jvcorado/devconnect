"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Posts } from "../app/page"; // considere mover o tipo para um arquivo de `types`

interface AboutProfileProps {
  publications: number;
  likes: number;
  followers: number;
  following: number;
}

interface PostContextProps {
  newPosts: boolean;
  setNewPosts: (value: boolean) => void;
  post: Posts[];
  setPost: (post: Posts[]) => void;
  openModal: boolean;
  setOpenModal: (value: boolean) => void;
  aboutProfile: AboutProfileProps;
}

const PostContext = createContext<PostContextProps | undefined>(undefined);

interface PostProviderProps {
  children: ReactNode;
}

export const PostProvider = ({ children }: PostProviderProps) => {
  const [post, setPost] = useState<Posts[]>([]);
  const [newPosts, setNewPosts] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [aboutProfile, setAboutProfile] = useState<AboutProfileProps>({
    publications: 0,
    likes: 0,
    followers: 0,
    following: 0,
  });

  const path = usePathname();
  const { data: session } = useSession();

  const userId = session?.user?.id;

  const getPosts = async () => {
    try {
      const res = await fetch("/api/post/list-all");
      const data = await res.json();

      const userPosts = (data ?? []).filter(
        (p: Posts) => p.user_id === session?.user?.id && p.content !== "feed"
      );

      const statsRes = await fetch(
        `/api/user/stats?userId=${session?.user?.id}`
      );
      const stats = await statsRes.json();

      setPost(userPosts);
      setAboutProfile({
        publications: stats.publications ?? 0,
        likes: userPosts.reduce(
          (acc: number, post: Posts) => acc + post.likes,
          0
        ),
        followers: stats.followers ?? 0,
        following: stats.following ?? 0,
      });
    } catch (err) {
      console.error("Erro ao buscar posts e stats:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      getPosts();
    }
  }, [userId]);

  useEffect(() => {
    if (newPosts) {
      getPosts();
      setNewPosts(false);
    }
  }, [newPosts]);

  useEffect(() => {
    if (path !== "/") {
      setOpenModal(false);
    }
  }, [path]);

  return (
    <PostContext.Provider
      value={{
        newPosts,
        setNewPosts,
        post,
        setPost,
        openModal,
        setOpenModal,
        aboutProfile,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = (): PostContextProps => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost deve ser usado dentro de um PostProvider");
  }
  return context;
};
