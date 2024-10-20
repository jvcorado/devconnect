"use client";

import React, { useState } from "react";
import { Input } from "@nextui-org/input";
import { Eye, EyeClosed } from "lucide-react";
import { Button } from "@nextui-org/button";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="  h-screen flex items-center justify-center">
      <div className="bg-secondary h-[80%] w-[30%] rounded-3xl flex  flex-col  gap-5 items-center pt-20 p-10 text-white shadow-2xl">
        <h1 className="text-4xl">DevConnect</h1>
        <p className="text-lg">Onde a Tecnologia Encontra a Conexão!</p>
        <Input
          size="lg"
          variant="flat"
          color="default"
          type="email"
          label="Email"
          placeholder="Enter your email"
          defaultValue=""
          className="w-full"
        />
        <Input
          size="lg"
          label="Password"
          variant="flat"
          color="default"
          placeholder="Enter your password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <Eye className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeClosed className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
        />

        <Button color="default" size="lg" className="text-white w-full">
          Login
        </Button>
      </div>
    </div>
  );
}
