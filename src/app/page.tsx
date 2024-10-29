"use client";

import { useLayoutEffect, useState } from "react";
import Header from "./components/header";
import NewPost from "./components/new_post";
import Post from "./components/post";
import { useMediaQuery } from "usehooks-ts";
import get from "./api/get";

import ReactPullToRefresh from "react-pull-to-refresh";
import { useAuth } from "./context/authContext";

export interface Posts {
  id: number;
  user_id: number;
  content: string;
  image_url: string;
  likes: number;
  shares: number;
  created_at: string;
}

export default function Home() {
  /*   const { isSignedIn } = useUser(); */
  const [newPost, setNewPost] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [feed, setFeed] = useState<Posts[]>([]);
  const { user } = useAuth();

  const isSignedIn = user?.token;

  const getPosts = async () => {
    const response = await get("post/list-all");
    setFeed(response.data ?? []);
  };

  useLayoutEffect(() => {
    getPosts();
  }, []);

  const handleRefresh = async () => {
    await getPosts();
  };

  return (
    <div className="flex flex-col gap-2 md:gap-3 relative ">
      <Header />

      <div className="pt-3  md:pt-0 w-[calc(100%_-_36px)] md:max-w-[60%] lg:max-w-[30%] flex flex-col gap-3 mx-auto">
        <NewPost setNewPost={setNewPost} newPost={newPost} setFeed={setFeed} />
      </div>

      <ReactPullToRefresh onRefresh={handleRefresh}>
        <div
          className={`${
            isSignedIn
              ? newPost && isDesktop
                ? "md:max-h-[calc(100vh_-_320px)] md:min-h-[calc(100vh_-_320px)]"
                : "md:max-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_180px)]"
              : "md:max-h-[calc(100vh_-_80px)] md:min-h-[calc(100vh_-_80px)]"
          } flex flex-col gap-3 w-full text-white mx-auto md:overflow-y-auto scroll-transparent  md:max-w-[60%] lg:max-w-[30%] h-full`}
        >
          <div className="flex flex-col md:gap-3 ">
            {feed
              .slice()
              .reverse()
              .map((post) => (
                <Post key={post.id} item={post} />
              ))}
          </div>
        </div>
      </ReactPullToRefresh>
    </div>
  );
}
