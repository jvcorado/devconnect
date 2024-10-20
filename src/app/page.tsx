"use client";

import { useState } from "react";
import Header from "./components/header";
import NewPost from "./components/new_post";
import Post from "./components/post";
import { useUser } from "@clerk/clerk-react";
import { useMediaQuery } from "usehooks-ts";

export interface Posts {
  id: string;
  image: string;
  user: string;
  title: string;
}

export default function Home() {
  const { isSignedIn } = useUser();
  const [newPost, setNewPost] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [feed, setFeed] = useState<Posts[]>([]);

  return (
    <div className="flex flex-col gap-2 lg:gap-3 relative ">
      <Header />

      <div className="pt-3  lg:pt-0 w-[90%] lg:max-w-[30%] flex flex-col gap-3 mx-auto">
        <NewPost setFeed={setFeed} setNewPost={setNewPost} newPost={newPost} />
      </div>

      <div
        className={`${
          isSignedIn
            ? newPost && isDesktop
              ? "lg:max-h-[calc(100vh_-_320px)] lg:min-h-[calc(100vh_-_320px)]"
              : "lg:max-h-[calc(100vh_-_180px)] lg:min-h-[calc(100vh_-_180px)]"
            : "lg:max-h-[calc(100vh_-_80px)] lg:min-h-[calc(100vh_-_80px)]"
        } flex flex-col gap-3 w-full text-white mx-auto lg:overflow-y-auto scroll-transparent lg:max-w-[30%] h-full`}
      >
        <div className="flex flex-col lg:gap-3">
          {feed.map((post) => (
            <Post key={post.id} item={post} setFeed={setFeed} />
          ))}
        </div>

        {/*  <Menu /> */}
      </div>
    </div>
  );
}
