"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { axiosApi } from "@/app/axiosApi/axiosApi";
import {
  setAuth,
  setIsLoading,
  setMessage,
} from "@/Redux/reducers/interfaceReducer";

import { useDispatch } from "react-redux";
import { setAuthCookie } from "@/lib/auth/cookies";

interface LoginProps {
  setIsLogin: (arg0: boolean) => void;
}

export const LoginForm = ({ setIsLogin }: LoginProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Estados para los campos del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Estados para validación
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "El email es requerido" }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Dirección de correo inválida" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: undefined }));
    return true;
  };

  // Validar password
  const validatePassword = (password: string): boolean => {
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "La contraseña es requerida",
      }));
      return false;
    }
    if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "La contraseña debe tener mínimo 8 caracteres",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, password: undefined }));
    return true;
  };

  // Función de envío del formulario
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validar campos
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    dispatch(setIsLoading(true));

    try {
      const response = await axiosApi.post("/auth/login", {
        email: email,
        password: password,
      });

      if (response.data.success) {
        const userData = response.data.data.user;
        const token = response.data.data.token;

        // Guardar usuario en Redux
        dispatch(setAuth(userData));

        // Guardar cookie de autenticación
        setAuthCookie(token);

        // Guardar token en localStorage (opcional)
        if (typeof window !== "undefined") {
          localStorage.setItem("authToken", token);
        }

        // Mostrar mensaje de éxito
        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "Inicio de sesión exitoso",
            desc: `Bienvenid@ ${userData.nombre}`,
          })
        );

        // Redirigir al dashboard
        router.push("/dashboard");
      } else {
        throw new Error(response.data.message || "Error al iniciar sesión");
      }
    } catch (error: any) {
      console.error("Error en login:", error);

      let errorMessage = "Error al iniciar sesión. Intenta nuevamente.";

      if (error.response?.status === 401) {
        errorMessage = "Email o contraseña incorrectos.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Error al iniciar sesión",
          desc: errorMessage,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={onSubmit} className="space-y-6 sm:space-y-8 p-4 sm:p-5">
        {/* Campo Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm sm:text-base">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Digite su email..."
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            className={`text-sm sm:text-base h-10 sm:h-11 ${
              errors.email ? "border-red-500" : ""
            }`}
          />
          {errors.email ? (
            <p className="text-xs sm:text-sm text-red-500">{errors.email}</p>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground">
              Asegúrese de ingresar un email válido
            </p>
          )}
        </div>

        {/* Campo Password */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm sm:text-base">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite su password..."
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              className={`text-sm sm:text-base h-10 sm:h-11 pr-10 ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </div>
          </div>
          {errors.password ? (
            <p className="text-xs sm:text-sm text-red-500">{errors.password}</p>
          ) : (
            <p className="text-xs sm:text-sm text-muted-foreground">
              La contraseña debe tener mínimo 8 caracteres
            </p>
          )}
        </div>

        {/* Botón de envío */}
        <div className="w-full flex justify-center pt-2">
          <Button
            type="submit"
            disabled={
              !!errors.email || !!errors.password || !email || !password
            }
            className="w-full sm:w-60 bg-white border border-indigo-700 border-2 text-indigo-700 hover:bg-indigo-700 hover:scale-105 hover:border-white transition duration-300 ease-in hover:text-white font-bold py-2 px-4 rounded text-sm sm:text-base h-10 sm:h-11 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-indigo-700 disabled:hover:scale-100"
          >
            Entrar
          </Button>
        </div>
      </form>

      {/* Link para registro */}
      <div className="flex gap-2 justify-center flex-wrap px-4">
        <h2 className="text-red-600 text-sm sm:text-base">
          ¿No te has registrado? &#128073;
        </h2>
        <a
          className="font-extrabold text-blue-600 cursor-pointer text-sm sm:text-base hover:underline"
          onClick={() => {
            setIsLogin(false);
          }}
        >
          Regístrate aquí
        </a>
      </div>
    </div>
  );
};
