"use client";

import { Button } from "@nextui-org/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import create from "../api/create";
import FormInput from "./inputUI/inputUI";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";

const userSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  /*  bio: z.string(),
  avatar_url: z.string().url(), */
});

export type UserInputSchema = z.infer<typeof userSchema>;

export default function Register() {
  const { setUser } = useAuth();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<UserInputSchema>({
    resolver: zodResolver(userSchema),
  });
  const onSubmit = async () => {
    let body = {};

    body = {
      name: watch("name"),
      username: watch("username"),
      email: watch("email"),
      password: watch("password"),
      bio: "",
      avatar_url: "",
    };

    const response = await create({ path: "user/create", body });

    if (response.status === 200 || response.status === 201) {
      console.log("User created successfully");
      reset({});
      setUser(response.data);
      router.push("/");
    } else {
      console.log("User not created");
    }
  };

  return (
    <div className="  h-screen flex items-center justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(() => onSubmit())();
        }}
        className="bg-secondary h-[80%] w-[30%] rounded-3xl flex  flex-col  gap-5 items-center pt-20 p-10 text-white shadow-2xl"
      >
        <h1 className="text-4xl">DevConnect</h1>
        <p className="text-lg">Onde a Tecnologia Encontra a Conexão!</p>

        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          control={control as never}
          error={errors as never}
        />
        <FormInput
          name="name"
          label="Name"
          type="text"
          placeholder="Enter your name"
          control={control as never}
          error={errors as never}
        />

        <FormInput
          name="username"
          label="Username"
          type="text"
          placeholder="Enter your username"
          control={control as never}
          error={errors as never}
        />

        <FormInput
          name="password"
          label="Password"
          type={"password"}
          placeholder="Enter your password"
          control={control as never}
          error={errors as never}
        />

        <Button
          type="submit"
          color="default"
          size="lg"
          className="text-white w-full"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
