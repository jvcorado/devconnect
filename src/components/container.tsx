"use client";

import { useAuth } from "@/context/authContext";
import React from "react";
/* import ReactPullToRefresh from "react-pull-to-refresh"; */
import { useMediaQuery } from "usehooks-ts";

export default function Container({
  openModal,
  children,
}: {
  openModal?: boolean;
  handleRefresh?: () => Promise<void>;
  children: React.ReactNode;
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { user } = useAuth();
  const isSignedIn = user?.token;

  return (
    <div className="flex flex-col gap-2 md:gap-3 relative ">
      {/*       <ReactPullToRefresh onRefresh={handleRefresh}> */}
      <div
        className={`${
          isSignedIn
            ? openModal && isDesktop
              ? "md:max-h-[calc(100vh_-_320px)] md:min-h-[calc(100vh_-_320px)]  max-sm-pb-[250px] md:!overflow-y-auto"
              : "md:max-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_180px)]  max-sm-pb-[250px] md:!overflow-y-auto"
            : "md:max-h-[calc(100vh_-_180px)] md:min-h-[calc(100vh_-_180px)]  max-sm-pb-[250px] md:!overflow-y-auto"
        } flex flex-col gap-3 w-full text-white mx-auto  md:overflow-y-auto scroll-transparent pb-[60px] md:pb-0 md:max-w-[60%] lg:max-w-[30%] h-full`}
      >
        {children}
      </div>
      {/*    </ReactPullToRefresh> */}
    </div>
  );
}
