"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import NewPost from "../components/new_post";
import Post from "../components/post";

import Container from "../components/container";

export interface Posts {
  id: number;
  user_id: string;
  content: string;
  image_url: string;
  likes: number;
  shares: number;
  created_at: string;
  username?: string;
  avatar_url?: string;
  likedByUser?: boolean;
  followedByUser?: boolean;
}

export default function Home() {
  const { data: session } = useSession();
  const [feed, setFeed] = useState<Posts[]>([]);

  const getPosts = async () => {
    const res = await fetch("/api/post/list-all", {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 0 },
    });
    const data = await res.json();

    console.log("data", data);

    const userId = session?.user?.id;

    /*  const userPosts = data.filter(
      (post: Posts) =>
        post.content !== "feed" && post.user_id === Number(userId)
    ); */

    setFeed(data);
  };

  useEffect(() => {
    if (session?.user?.id) {
      getPosts();
    }
  }, [session]);

  const handleRefresh = async () => {
    if (session?.user?.id) {
      await getPosts();
    }
  };

  console.log("feed", feed);

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
