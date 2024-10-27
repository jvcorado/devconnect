import React, { HTMLInputTypeAttribute } from "react";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Input } from "@nextui-org/input";

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
            type={type}
            label={label}
            placeholder={placeholder}
            className="w-full"
          />
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
        </div>
      )}
    />
  );
};

export default FormInput;
