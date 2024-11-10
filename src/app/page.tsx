"use client";

import { useEffect, useState } from "react";
import NewPost from "../components/new_post";
import Post from "../components/post";
import get from "../api/get";
import Container from "@/components/container";

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
  const [feed, setFeed] = useState<Posts[]>([]);

  const getPosts = async () => {
    const response = await get("post/list-all");
    setFeed(response.data ?? []);
  };

  useEffect(() => {
    getPosts();
  }, []);

  const handleRefresh: () => Promise<void> = async () => {
    await getPosts();
  };

  return (
    <div className="flex flex-col gap-2 md:gap-3 relative ">
      <NewPost setFeed={setFeed} />
      <Container handleRefresh={handleRefresh}>
        <div className="flex flex-col md:gap-3">
          {feed
            .slice()
            .reverse()
            .map((post) => (
              <Post key={post.id} item={post} />
            ))}
        </div>
      </Container>
    </div>
  );
}
