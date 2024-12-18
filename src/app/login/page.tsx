"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import Link from "next/link";

import { Button } from "@nextui-org/button";
import { useAuth } from "@/context/authContext";
import login from "@/api/login";
import { User } from "@/components/post";
import Modals from "@/components/modalUI/modal";
import FormInput from "@/components/inputUI/inputUI";

const userSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export type UserInputSchema = z.infer<typeof userSchema>;

export default function Login() {
  const router = useRouter();
  const { setUser, openLogin, setOpenLogin } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<UserInputSchema>({
    resolver: zodResolver(userSchema),
  });

  async function onSubmit() {
    const response = await login({
      body: {
        email: watch("email"),
        password: watch("password"),
      },
    });

    if (response.status === 200 || response.status === 201) {
      setUser(response.data as User);
      router.push("/");
    } else {
      console.error("Erro no login:", response.data);
    }
  }

  if (openLogin) {
    return (
      <Modals
        isOpen={openLogin}
        onOpenChange={() => setOpenLogin(false)}
        onClose={() => router.push("/")}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }}
          className="flex flex-col gap-5 items-center pt-20 p-10 text-white max-md:overflow-y-auto max-md:max-h-[80vh] max-md:scroll-transparent"
        >
          <div className="loader"></div>
          <h1 className="text-4xl">DevConnect</h1>
          <p className="text-lg text-center">
            Onde a Tecnologia Encontra a Conexão!
          </p>

          <div tabIndex={1} className="w-full">
            <FormInput
              name="email"
              label="Email"
              type="text"
              placeholder="Enter your email"
              control={control as never}
              error={errors as never}
            />
          </div>

          <FormInput
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            control={control as never}
            error={errors as never}
          />

          <Button type="submit" color="primary" className="w-full" size="lg">
            {isSubmitting ? <p className="loader">.</p> : "Login"}
          </Button>

          <Link
            onClick={() => setOpenLogin(false)}
            href={"/register"}
            className="text-sm text-center"
          >
            Não Possui uma conta? Criar agora gratuitamente{" "}
          </Link>

          <Link
            href={"/"}
            onClick={() => setOpenLogin(false)}
            className="text-sm text-center"
          >
            Acessar sem fazer login
          </Link>
        </form>
      </Modals>
    );
  }

  return null;
}
