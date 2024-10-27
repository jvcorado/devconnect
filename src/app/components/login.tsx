"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import get from "../api/get";
import FormInput from "./inputUI/inputUI";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { User } from "./post";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";

const userSchema = z.object({
  username: z.string(),
  email: z.string().email(),
});

export type UserInputSchema = z.infer<typeof userSchema>;

export default function Login() {
  const [userData, setUserData] = useState<User[]>([]);
  const [userFiltered, setUserFiltered] = useState<User[]>([]);
  const router = useRouter();
  const { setUser } = useAuth();

  const {
    control,
    formState: { errors },
    watch,
  } = useForm<UserInputSchema>({
    resolver: zodResolver(userSchema),
  });

  const getUserData = async () => {
    const response = await get("user/list-all");
    setUserData(response.data ?? []);
  };

  const filterUserData = (email: string) => {
    const data = userData.filter((user: User) => user.email === email);
    return setUserFiltered(data);
  };

  useLayoutEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData.length > 0) {
      filterUserData(watch("email"));
    }
  }, [userData, watch("email")]);

  const handleLogin = async () => {
    try {
      setUser(userFiltered[0]);
      router.push("/");
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-secondary h-[80%] w-[30%] rounded-3xl flex flex-col gap-5 items-center pt-20 p-10 text-white shadow-2xl">
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
          name="username"
          label="Username"
          type="text"
          placeholder="Enter your username"
          control={control as never}
          error={errors as never}
        />

        <Button
          color="default"
          size="lg"
          className="text-white w-full"
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
