"use client";

import get from "@/api/get";
import Container from "@/components/container";
import ModalSm from "@/components/modal_sm";
import Post from "@/components/post";
import { useAuth } from "@/context/authContext";
import { Avatar } from "@nextui-org/avatar";
import { usePost } from "@/context/postContext";

export default function Profile() {
  const { user } = useAuth();
  const { post, aboutProfile } = usePost();

  const getPosts = async () => {
    const response = await get("post/list-all");
    return response.data ?? [];
  };

  const handleRefresh: () => Promise<void> = async () => {
    await getPosts();
  };

  return (
    <div className="flex flex-col gap-2 md:gap-3 relative ">
      <ModalSm>
        <div className="flex flex-col w-full">
          <div className=" flex gap-1">
            <Avatar src={user?.avatar_url} />
            <div className="flex flex-col gap-1 items-start justify-center ps-4">
              <h4 className="text-small font-semibold leading-none text-[#ffffff]">
                {user?.name}
              </h4>
              <h5 className="text-small tracking-tight text-[#ffffff8e]">
                {user?.bio ? user?.bio : "Cadastre sua biografia"}
              </h5>
            </div>
          </div>

          <div className="text-white flex gap-2 items-center justify-center flex- w-full mt-2">
            <div className=" p-2 rounded-2xl flex items-center justify-center gap-2 ">
              <div className="flex flex-col gap-3 items-center">
                <p>Publicação </p>
                <p>{aboutProfile.publications}</p>
              </div>
              <div className="flex flex-col gap-3 items-center">
                <p>Curtidas </p>
                <p>{aboutProfile.likes}</p>
              </div>
              <div className="flex flex-col gap-3 items-center">
                <p>Seguidores </p>
                <p>{aboutProfile.followers}</p>
              </div>
              <div className="flex flex-col gap-3 items-center">
                <p>Seguindo </p>
                <p>{aboutProfile.following}</p>
              </div>
            </div>
          </div>
          <div>Editar</div>
        </div>
      </ModalSm>

      <Container handleRefresh={handleRefresh}>
        <div className="flex flex-col md:gap-3 ">
          {post
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
