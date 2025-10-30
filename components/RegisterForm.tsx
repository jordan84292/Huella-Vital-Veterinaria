"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    nombre: z.string().min(1, "El nombre no puede estar vacío"),
    email: z.string().email("Dirección de correo inválida"),
    telefono: z
      .string()
      .regex(/^\d+$/, "El teléfono solo permite números")
      .min(8, "El teléfono debe tener mínimo 8 dígitos")
      .max(8, "El teléfono debe tener exactamente 8 dígitos"),
    password: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres"),
    confirmPassword: z.string().min(1, "Debes confirmar la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, MouseEvent, SetStateAction } from "react";

interface registerProps {
  setIsloading: (arg0: boolean) => void;
  setMessage: Dispatch<
    SetStateAction<{
      type: string;
      text: string;
      desc: string;
    }>
  >;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
}

export const RegisterForm = ({
  setIsloading,
  setMessage,
  setIsLogin,
}: registerProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newJson = { ...values, ["telefono"]: `+506 ${values.telefono}` };
    const sendInfo = async () => {
      setIsloading(true);
      fetch("http://localhost:5000/api/v1/auth/register", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJson),
      })
        .then(async (res) => {
          const json = await res.json();
          if (!json.success) throw new Error(json.message);
          setMessage({
            type: "",
            text: "Registro exitoso",
            desc: json.message,
          });
          setTimeout(() => {
            setIsLogin(true);
          }, 3000);
        })
        .catch((err) => {
          setMessage({
            type: "error",
            text: "Error al registrarse",
            desc: err.message,
          });
        })
        .finally(() => {
          setTimeout(() => {
            setIsloading(false);
          }, 1000);
        });
    };
    sendInfo();
  }

  const loginReturn = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    setIsLogin(true);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 px-5  "
        >
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Digite su nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Digite su email..." {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefono</FormLabel>
                <FormControl>
                  <Input placeholder="Digite su telefono" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite su password..."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Digite nuevamente su password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Digite nuevamente su password..."
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center">
            <Button
              type="submit"
              className=" w-40 bg-white border border-indigo-700 border-2 text-indigo-700 hover:bg-indigo-700 hover:scale-105 hover:border-white transition duration-300 ease-in hover:text-white font-bold py-2 px-4 rounded"
            >
              Registrarse
            </Button>
            <Button
              className="ms-2 w-40 bg-white border border-indigo-700 border-2 text-indigo-700 hover:bg-indigo-700 hover:scale-105 hover:border-white transition duration-300 ease-in hover:text-white font-bold py-2 px-4 rounded"
              onClick={(e) => loginReturn(e)}
            >
              Volver
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
