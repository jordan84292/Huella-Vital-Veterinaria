"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { axiosApi } from "@/app/axiosApi/axiosApi";
import { useDispatch } from "react-redux";
import { setIsLoading, setMessage } from "@/Redux/reducers/interfaceReducer";

interface RegisterProps {
  setIsLogin: Dispatch<SetStateAction<boolean>>;
}

export const RegisterForm = ({ setIsLogin }: RegisterProps) => {
  const dispatch = useDispatch();

  // Estados para los campos del formulario
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Estados para mostrar/ocultar contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para validación
  const [errors, setErrors] = useState<{
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasSpecialChar: false,
  });

  // Validar email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "El email es requerido" }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Email inválido" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: undefined }));
    return true;
  };

  // Validar contraseña actual
  const validateCurrentPassword = (password: string): boolean => {
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: "La contraseña actual es requerida",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, currentPassword: undefined }));
    return true;
  };

  // Validar nueva contraseña
  const validateNewPassword = (password: string): boolean => {
    const errors: string[] = [];

    if (!password) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "La nueva contraseña es requerida",
      }));
      return false;
    }

    if (password.length < 8) {
      errors.push("mínimo 8 caracteres");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("una letra mayúscula");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("un carácter especial");
    }

    if (errors.length > 0) {
      setErrors((prev) => ({
        ...prev,
        newPassword: `La contraseña debe tener ${errors.join(", ")}`,
      }));
      return false;
    }

    setErrors((prev) => ({ ...prev, newPassword: undefined }));
    return true;
  };

  // Validar confirmación de contraseña
  const validateConfirmPassword = (
    confirm: string,
    newPass: string
  ): boolean => {
    if (!confirm) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Debes confirmar la contraseña",
      }));
      return false;
    }
    if (confirm !== newPass) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    return true;
  };

  // Evaluar fortaleza de la contraseña
  const evaluatePasswordStrength = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    });
  };

  // Verificar si la nueva contraseña es válida
  const isNewPasswordValid =
    passwordStrength.hasMinLength &&
    passwordStrength.hasUpperCase &&
    passwordStrength.hasSpecialChar;

  // Función principal de envío
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validar todos los campos
    const isEmailValid = validateEmail(email);
    const isCurrentValid = validateCurrentPassword(currentPassword);
    const isNewValid = validateNewPassword(newPassword);
    const isConfirmValid = validateConfirmPassword(
      confirmPassword,
      newPassword
    );

    if (!isEmailValid || !isCurrentValid || !isNewValid || !isConfirmValid) {
      return;
    }

    dispatch(setIsLoading(true));

    try {
      // PASO 1: Login para verificar credenciales y obtener token
      console.log("Verificando credenciales...");
      const loginResponse = await axiosApi.post("/auth/login", {
        email: email,
        password: currentPassword,
      });

      if (!loginResponse.data.success) {
        throw new Error("Credenciales incorrectas");
      }

      const { token, user } = loginResponse.data.data;
      console.log("Login exitoso, usuario:", user);

      // Mostrar mensaje de verificación
      dispatch(
        setMessage({
          view: true,
          type: "",
          text: "Credenciales verificadas",
          desc: `Hola ${user.nombre}, actualizando tu contraseña...`,
        })
      );

      // PASO 2: Actualizar contraseña usando el endpoint de auth/profile
      console.log("Actualizando contraseña...");

      const updateResponse = await axiosApi.put(
        "/auth/profile",
        {
          nombre: user.nombre,
          email: user.email,
          telefono: user.telefono,
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Respuesta de actualización:", updateResponse.data);

      if (updateResponse.data.success) {
        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "¡Contraseña actualizada!",
            desc: "Tu contraseña ha sido cambiada correctamente. Redirigiendo al login...",
          })
        );

        // Limpiar formulario
        setEmail("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordStrength({
          hasMinLength: false,
          hasUpperCase: false,
          hasSpecialChar: false,
        });
        setErrors({});

        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          setIsLogin(true);
        }, 3000);
      } else {
        throw new Error(
          updateResponse.data.message || "Error al actualizar la contraseña"
        );
      }
    } catch (error: any) {
      console.error("Error completo:", error);

      let errorMessage =
        "No se pudo cambiar la contraseña. Intenta nuevamente.";

      if (error.response?.status === 401) {
        errorMessage = "Email o contraseña actual incorrectos.";
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || "Datos inválidos.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Error al cambiar contraseña",
          desc: errorMessage,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  }

  const loginReturn = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLogin(true);
  };

  // Componente para mostrar requisitos de contraseña
  const PasswordRequirements = () => (
    <div className="mt-2 space-y-1">
      <p className="text-sm font-medium">Requisitos de la contraseña:</p>
      <div className="space-y-1">
        <div
          className={`flex items-center text-xs ${
            passwordStrength.hasMinLength ? "text-green-600" : "text-gray-500"
          }`}
        >
          <span className="mr-1">
            {passwordStrength.hasMinLength ? "✓" : "○"}
          </span>
          Mínimo 8 caracteres
        </div>
        <div
          className={`flex items-center text-xs ${
            passwordStrength.hasUpperCase ? "text-green-600" : "text-gray-500"
          }`}
        >
          <span className="mr-1">
            {passwordStrength.hasUpperCase ? "✓" : "○"}
          </span>
          Al menos una letra mayúscula
        </div>
        <div
          className={`flex items-center text-xs ${
            passwordStrength.hasSpecialChar ? "text-green-600" : "text-gray-500"
          }`}
        >
          <span className="mr-1">
            {passwordStrength.hasSpecialChar ? "✓" : "○"}
          </span>
          Al menos un carácter especial (!@#$%^&* etc.)
        </div>
      </div>
    </div>
  );

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 sm:space-y-4 px-4 sm:px-5 py-4 max-w-md mx-auto w-full"
    >
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-center">
          Cambiar Contraseña
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground text-center mt-1 sm:mt-2 px-2">
          Ingresa tus credenciales actuales y tu nueva contraseña
        </p>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Digite su email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          className="text-sm sm:text-base h-10 sm:h-11"
        />
        {errors.email && (
          <p className="text-xs sm:text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Contraseña actual */}
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="text-sm sm:text-base">
          Contraseña Actual
        </Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Digite contraseña actual"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              validateCurrentPassword(e.target.value);
            }}
            className="text-sm sm:text-base h-10 sm:h-11 pr-10"
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? (
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </div>
        </div>
        {errors.currentPassword && (
          <p className="text-xs sm:text-sm text-red-500">
            {errors.currentPassword}
          </p>
        )}
      </div>

      {/* Nueva contraseña */}
      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-sm sm:text-base">
          Nueva Contraseña
        </Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            placeholder="Digite nueva contraseña"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              evaluatePasswordStrength(e.target.value);
              validateNewPassword(e.target.value);
            }}
            className="text-sm sm:text-base h-10 sm:h-11 pr-10"
          />
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? (
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </div>
        </div>
        <PasswordRequirements />
        {errors.newPassword && (
          <p className="text-xs sm:text-sm text-red-500">
            {errors.newPassword}
          </p>
        )}
      </div>

      {/* Confirmar contraseña */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm sm:text-base">
          Confirmar Contraseña
          {!isNewPasswordValid && (
            <span className="text-[10px] sm:text-xs text-muted-foreground ml-1 sm:ml-2 block sm:inline">
              (completa los requisitos primero)
            </span>
          )}
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Digite contraseña nuevamente"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateConfirmPassword(e.target.value, newPassword);
            }}
            disabled={!isNewPasswordValid}
            className={`text-sm sm:text-base h-10 sm:h-11 pr-10 ${
              !isNewPasswordValid ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
          <div
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 ${
              isNewPasswordValid
                ? "cursor-pointer hover:text-gray-700"
                : "cursor-not-allowed opacity-50"
            }`}
            onClick={() => {
              if (isNewPasswordValid) {
                setShowConfirmPassword(!showConfirmPassword);
              }
            }}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </div>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs sm:text-sm text-red-500">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Botones */}
      <div className="w-full flex flex-col sm:flex-row justify-center pt-3 sm:pt-4 gap-2">
        <Button
          type="submit"
          disabled={
            !isNewPasswordValid ||
            !confirmPassword ||
            !!errors.confirmPassword ||
            !!errors.email ||
            !!errors.currentPassword
          }
          className="w-full sm:w-40 bg-white border border-indigo-700 border-2 text-indigo-700 hover:bg-indigo-700 hover:scale-105 hover:border-white transition duration-300 ease-in hover:text-white font-bold py-2 px-4 rounded text-sm sm:text-base h-10 sm:h-11 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-indigo-700 disabled:hover:scale-100"
        >
          Cambiar Contraseña
        </Button>
        <Button
          type="button"
          onClick={loginReturn}
          className="w-full sm:w-40 bg-white border border-indigo-700 border-2 text-indigo-700 hover:bg-indigo-700 hover:scale-105 hover:border-white transition duration-300 ease-in hover:text-white font-bold py-2 px-4 rounded text-sm sm:text-base h-10 sm:h-11"
        >
          Volver
        </Button>
      </div>
    </form>
  );
};
