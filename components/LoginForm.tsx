"use client";

import { json, z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.email("Direccion de correo invalida"),
  password: z.string().min(8, "La contrasena no cumple los requisitos"),
});

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface loginProps {
  setIsLogin: (arg0: boolean) => void;
  setMessage: Dispatch<
    SetStateAction<{
      type: string;
      text: string;
      desc: string;
    }>
  >;
  setIsloading: Dispatch<SetStateAction<boolean>>;
}

export const LoginForm = ({
  setIsLogin,
  setMessage,
  setIsloading,
}: loginProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then(async (res) => {
        setIsloading(true);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        localStorage.setItem(
          "data",
          JSON.stringify({
            name: data.data.user.nombre,
            email: data.data.user.email,
          })
        );

        router.push("/dashboard");
      })
      .catch((err) => {
        setMessage({
          type: "error",
          text: "Error al ingresar",
          desc: err.message,
        });
      })
      .finally(() => {
        setTimeout(() => {
          setIsloading(false);
        }, 1000);
      });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 p-5  "
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Digite su email..." {...field} />
                </FormControl>
                <FormDescription>
                  Asegurese de ingresar un email valido
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite su password..."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  La contrasena debe tener minimo 8 digitos...
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button
              type="submit"
              className=" w-60 bg-white border border-indigo-700 border-2 text-indigo-700 hover:bg-indigo-700 hover:scale-105 hover:border-white transition duration-300 ease-in hover:text-white font-bold py-2 px-4 rounded"
            >
              Entrar
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex gap-2">
        <h2 className="text-red-600">No te has registrado? &#128073;</h2>
        <a
          className="font-extrabold text-blue-600 cursor-pointer"
          onClick={() => {
            setIsLogin(false);
          }}
        >
          Registrate aquí
        </a>
      </div>
    </>
  );
};
