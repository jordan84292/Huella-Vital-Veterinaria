"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import {
  setIsLoading,
  setMessage,
  setAuth,
} from "@/Redux/reducers/interfaceReducer";
import { axiosApi } from "../axiosApi/axiosApi";
import { useRouter } from "next/navigation";
import {
  setAuthCookie,
  getAuthCookie,
  deleteAuthCookie,
} from "@/lib/auth/cookies";

export default function ConfiguracionPage() {
  const user = useSelector((state: RootState) => state.interface.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({
    ...user,
    password: "",
    currentPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setIsLoading(true));

    try {
      const currentToken = await getAuthCookie();

      // Si se está intentando cambiar la contraseña, usar ruta de auth
      if (formData.password) {
        // Validar que se haya ingresado la contraseña actual
        if (!formData.currentPassword) {
          dispatch(
            setMessage({
              view: true,
              type: "Error",
              text: "Error de validación",
              desc: "Debes ingresar tu contraseña actual para cambiarla",
            })
          );
          dispatch(setIsLoading(false));
          return;
        }

        // Preparar datos para actualización con contraseña
        const dataToSend = {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          currentPassword: formData.currentPassword,
          newPassword: formData.password,
        };

        const res = await axiosApi.put("/auth/profile", dataToSend, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "¡Éxito!",
            desc: res.data.message || "Perfil actualizado correctamente",
          })
        );

        // Obtener perfil actualizado
        const profileRes = await axiosApi.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });

        // Actualizar estado global
        dispatch(
          setAuth({
            ...user,
            ...profileRes.data.data,
          })
        );
      } else {
        // Si NO se está cambiando la contraseña, usar ruta de users
        const dataToSend = {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          rolName: formData.rolName,
          status: formData.status,
        };

        const res = await axiosApi.put(`/users/${user.id}`, dataToSend);

        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "¡Éxito!",
            desc: res.data.message,
          })
        );

        // Actualizar el estado global con los nuevos datos
        const updatedUser = await axiosApi.get(`/users/${user.id}`);
        dispatch(
          setAuth({
            ...user,
            ...updatedUser.data.data,
          })
        );
      }

      // Renovar el token después de cualquier actualización
      try {
        const refreshRes = await axiosApi.post(
          "/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
            },
          }
        );

        // Guardar el nuevo token en las cookies
        if (refreshRes.data.success && refreshRes.data.data.token) {
          await setAuthCookie(refreshRes.data.data.token);
          console.log("Token renovado y guardado correctamente");
        }
      } catch (refreshError: any) {
        console.error("Error al renovar token:", refreshError);
        // No mostramos error al usuario, ya que la actualización fue exitosa
      }

      // Limpiar campos de contraseña
      setFormData((prev) => ({
        ...prev,
        password: "",
        currentPassword: "",
      }));

      router.push("/dashboard");
    } catch (error: any) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: error.response?.statusText || "Error",
          desc: error.response?.data?.message || error.message,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales del usuario
    if (user) {
      setFormData({
        ...user,
        password: "",
        currentPassword: "",
      });
    }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="p-4 md:ml-64 md:p-6">
        <div className="mb-4 md:mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Configuración
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Actualiza tu información personal y profesional
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Editar Perfil</CardTitle>
            <CardDescription className="text-sm">
              Modifica tus datos personales y profesionales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  required
                />
              </div>

              <div className="border-t pt-4 md:pt-6">
                <h3 className="text-base font-semibold mb-4">
                  Cambiar Contraseña
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Completa estos campos solo si deseas cambiar tu contraseña
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Ingresa tu contraseña actual"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Nueva Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Ingresa tu nueva contraseña"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 md:pt-6">
                <h3 className="text-base font-semibold mb-4">
                  Información Profesional
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="rol">Rol</Label>
                    <Select
                      value={formData.rolName}
                      onValueChange={(value) =>
                        setFormData({ ...formData, rolName: value })
                      }
                    >
                      <SelectTrigger id="rol">
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrador">
                          Administrador
                        </SelectItem>
                        <SelectItem value="Veterinario">Veterinario</SelectItem>
                        <SelectItem value="Asistente">Asistente</SelectItem>
                        <SelectItem value="Recepcionista">
                          Recepcionista
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Activo">Activo</SelectItem>
                        <SelectItem value="Inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {user?.fecha_creacion && (
                <div className="border-t pt-4 md:pt-6">
                  <h3 className="text-base font-semibold mb-4">
                    Información de la Cuenta
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Fecha de Creación</Label>
                      <Input
                        value={new Date(user.fecha_creacion).toLocaleDateString(
                          "es-ES"
                        )}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    {user?.fecha_actualizacion && (
                      <div className="space-y-2">
                        <Label>Última Actualización</Label>
                        <Input
                          value={new Date(
                            user.fecha_actualizacion
                          ).toLocaleDateString("es-ES")}
                          disabled
                          className="bg-muted"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent"
                  onClick={handleCancel}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="w-full sm:w-auto">
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
