"use client";

import { useState } from "react";
import Header from "./components/header";
import NewPost from "./components/new_post";
import Post from "./components/post";
import { ChevronLeft } from "lucide-react";
import { Textarea } from "@nextui-org/input";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";
import { Button } from "@nextui-org/button";

export default function Home() {
  const [newPost, setNewPost] = useState(false);
  const { user, isSignedIn } = useUser();

  if (newPost) {
    return (
      <div className="bg-[#181818] text-white w-[100%] h-[100%] overflow-y-hidden p-3 translate-all duration-250 z-[50] fixed left-0 bottom-0 lg:hidden">
        <div className="flex items-center mb-5">
          <ChevronLeft
            size={24}
            color="#777777"
            onClick={() => setNewPost(false)}
          />
          <h1 className="text-center mx-auto">Novo Post</h1>
        </div>
        <div className="flex gap-5 items-center">
          <Image
            src={user?.imageUrl ?? ""}
            alt={"image"}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {user?.fullName}
            </h4>
          </div>
        </div>
        <div className="w-[calc(100%_-_70px)] ms-[54px] mt-5 flex flex-col  gap-5 justify-end">
          <Textarea
            label="Description"
            placeholder="Enter your description"
            defaultValue="NextUI is a React UI library that provides a set of accessible, reusable, and beautiful components."
          />
          <Button
            className={
              "bg-[#777777] text-[#ffffff] border-default-200 self-end"
            }
            radius="full"
            size="sm"
            variant={"solid"}
            onPress={() => {}}
          >
            Send
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-2 lg:gap-3 relative">
      <Header />

      <div className="pt-3 lg:pt-0 w-full lg:max-w-[30%]  mx-auto">
        <NewPost setNewPost={setNewPost} newPost={newPost} />
      </div>

      <div
        className={`${
          isSignedIn
            ? " lg:max-h-[calc(100vh_-_180px)] lg:min-h-[calc(100vh_-_180px)] "
            : " lg:max-h-[calc(100vh_-_80px)] lg:min-h-[calc(100vh_-_80px)] bg-slate-400 "
        } flex flex-col gap-3  w-full text-white  mx-auto lg:overflow-y-auto  scroll-transparent lg:max-w-[30%] h-full `}
      >
        <div className="flex flex-col gap-3">
          {Array.from({ length: 40 }).map((_, index) => (
            <Post key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}
