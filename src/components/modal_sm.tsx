"use client";

import { usePost } from "@/context/postContext";
import React from "react";

export default function ModalSm({
  handleKeyDownEsc,
  children,
}: {
  handleKeyDownEsc?: (event: React.KeyboardEvent) => void;
  children: React.ReactNode;
}) {
  const { openModal } = usePost();

  return (
    <div className="pt-3  md:pt-0 w-[calc(100%_-_36px)] md:max-w-[60%] lg:max-w-[30%] flex flex-col gap-3 mx-auto">
      <div
        onKeyDown={handleKeyDownEsc}
        className={`w-full py-2 rounded-2xl flex items-start bg-[#181818]  ${
          openModal ? "ps-5 " : "ps-5"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
