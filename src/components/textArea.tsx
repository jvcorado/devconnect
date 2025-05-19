"use client";

import { Textarea } from "@nextui-org/input";

import { Control, Controller } from "react-hook-form";
import ButtonOption from "./ButtonOption";
import {
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import Image from "next/image";
import { CircleX, Paperclip } from "lucide-react";

interface TextareaInputProps {
  control: Control;
  name: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  errorMessage?: string;
  className?: string;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onClose: () => void;
  onSubmit: () => void;
  isUpload?: boolean;
  setUrl?: (info: CloudinaryInfo | null) => void;
  urlImage?: CloudinaryInfo | null;
}

interface CloudinaryInfo {
  url: string;
}

const TextareaInput: React.FC<TextareaInputProps> = ({
  control,
  name,
  setUrl,
  urlImage,
  isUpload = false,
  placeholder = "Enter your text",
  defaultValue = "",
  errorMessage,
  onKeyDown,
  onClose,
  onSubmit,
}) => {
  const style = {
    innerWrapper: ["bg-[#181818] md:bg-[#292929]"],
    input: ["text-white", "!shadow-none"],
    inputWrapper: [
      "bg-[#181818] md:bg-[#292929]",
      "group-data-[focus=true]:!ring-0",
      "group-data-[focus=true]:!ring-transparent",
      "group-data-[focus=true]:!border-none",
      "data-[hover=true]:!border-none",
      "outline-none",
      "!min-[10px]",
      "!max-h-auto",
      "focus:outline-none focus:ring-0 focus:shadow-none",
    ],
  };

  return (
    <div className="w-full  flex flex-col  bg-[#181818] md:bg-[#292929] rounded-2xl ">
      {urlImage && (
        <div className="relative w-[200px] ">
          <Image
            src={urlImage.url}
            width={200}
            height={200}
            alt=""
            className="p-3 "
          />
          <CircleX
            size={24}
            color="#b12b2b"
            onClick={() => setUrl?.(null)}
            className="absolute top-1 right-1 text-black bg-[#181818] md:bg-[#292929]   rounded-full z-50 cursor-pointer"
          />
        </div>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Textarea
            minRows={1}
            {...field}
            errorMessage={errorMessage}
            variant="bordered"
            color="secondary"
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            defaultValue={defaultValue}
            classNames={style}
            autoFocus
          />
        )}
      />

      <div
        className={`${
          isUpload ? "justify-between" : "self-end"
        } px-3 pb-3  flex items-center gap-3 `}
      >
        {isUpload && (
          <CldUploadWidget
            uploadPreset="devconnect"
            onSuccess={(results: CloudinaryUploadWidgetResults) => {
              if (results.info) {
                const info: CloudinaryInfo =
                  typeof results.info === "string"
                    ? { url: results.info }
                    : results.info;

                setUrl?.(info || null);
              }
            }}
          >
            {({ open }) => (
              <Paperclip
                onClick={() => open()}
                size={24}
                color="white"
                className="cursor-pointer"
              />
            )}
          </CldUploadWidget>
        )}

        <div className="flex gap-3 items-center">
          <ButtonOption
            text={"Cancel"}
            color="cancel"
            onClick={() => {
              onClose();
            }}
          />
          <ButtonOption
            text={"Add"}
            onClick={() => {
              onSubmit();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TextareaInput;
