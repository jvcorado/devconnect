import { Button } from "@nextui-org/button";
import React from "react";

export default function ButtonOption({
  text,
  onClick,
  color = "send",
}: {
  text: string;
  onClick: () => void;
  color?: "cancel" | "send"; // Added quotes around the string literals for TypeScript type checking
}) {
  return (
    <Button
      className={`${
        color === "cancel" ? "bg-[#b12b2b]" : "bg-[#2B50A7]"
      } text-[#ffffff] border-default-200 w-[70px] self-end`}
      radius="full"
      size="sm"
      variant="solid"
      onPress={onClick}
    >
      {text}
    </Button>
  );
}
