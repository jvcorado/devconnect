"use client";

import React, { HTMLInputTypeAttribute } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input } from "@nextui-org/input";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  error?: FieldErrors<{ message: string }> | FieldErrors;
  type?: HTMLInputTypeAttribute;
  label?: string;
  placeholder: string;
  name: string;
  control: Control;
  disabled?: boolean;
  search?: boolean;
  currrency?: boolean;
  password?: boolean;
  mask?: (value: string) => string;
  allUpperCase?: boolean;
  colourEye?: React.CSSProperties;
}

const FormInput: React.FC<FormInputProps> = ({
  type = "text",
  label,
  name,
  control,
  placeholder,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className="w-full">
          <Input
            {...field}
            size="lg"
            variant="flat"
            color="default"
            type={isVisible ? "text" : type}
            label={label}
            placeholder={placeholder}
            className="w-full"
            endContent={
              type === "password" && (
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <Eye className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeOff className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              )
            }
          />
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
      )}
    />
  );
};

export default FormInput;
