"use client";

import get from "@/api/get";
import { Posts } from "@/app/page";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./authContext";
import { usePathname } from "next/navigation";

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

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [post, setPost] = useState<Posts[]>([]);
  const [newPosts, setNewPosts] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [aboutProfile, setAboutProfile] = useState({
    publications: 0,
    likes: 0,
    followers: 0,
    following: 0,
  });

  const path = usePathname();
  const { user } = useAuth();
  const id_user = Number(user?.id);

  const getPosts = async () => {
    const response = await get("post/list-all");
    const data = response.data ?? [];
    const filteredPost = data.filter((post: Posts) => post.user_id === id_user);

    const publications = filteredPost.length;
    const likes = filteredPost.reduce(
      (acc: number, post: Posts) => acc + post.likes,
      0
    );

    const followers = 0;
    const following = 0;

    setPost(filteredPost);
    setAboutProfile({ publications, likes, followers, following });
  };

  useEffect(() => {
    getPosts();
  }, [id_user, newPosts]);

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
    throw new Error("usePost must be used within an PostProvider");
  }

  return context;
};
