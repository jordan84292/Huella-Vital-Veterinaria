"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosApi } from "@/app/axiosApi/axiosApi";
import { useDispatch } from "react-redux";
import {
  setIsLoading,
  setMessage,
  setUsers,
} from "@/Redux/reducers/interfaceReducer";
import { validateUser } from "@/lib/validations";

export enum UserRole {
  ADMIN = "Administrador",
  VET = "Veterinario",
  RECEP = "Recepcionista",
  ASIST = "Asistente",
}

// Mapeo entre string legible y número para backend
export const UserRoleToNumber: Record<UserRole, string> = {
  [UserRole.ADMIN]: "1",
  [UserRole.VET]: "2",
  [UserRole.RECEP]: "3",
  [UserRole.ASIST]: "4",
};
export const NumberToUserRole: Record<string, UserRole> = {
  "1": UserRole.ADMIN,
  "2": UserRole.VET,
  "3": UserRole.RECEP,
  "4": UserRole.ASIST,
};

export type User = {
  id: string;
  nombre: string;
  email: string;
  rol: UserRole;
  status: "Activo" | "Inactivo";
  telefono: string;
};

type UserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
};
const initialForm: User = {
  id: "",
  nombre: "",
  email: "",
  telefono: "",
  rol: UserRole.ASIST, // Asistente por defecto
  status: "Activo",
};
export function UserDialog({ open, onOpenChange, user }: UserDialogProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<User>(initialForm);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        rol: NumberToUserRole[user.rol] ?? UserRole.ASIST,
        status: user.status,
      });
    } else {
      setFormData(initialForm);
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setIsLoading(true));

    // Convertir rol a número antes de enviar al backend
    const dataToSend = {
      ...formData,
      rol: UserRoleToNumber[formData.rol],
    };

    const sendData = async () => {
      try {
        let res;
        if (!user) {
          res = await axiosApi.post("/users", dataToSend);
        } else {
          res = await axiosApi.put(`/users/${formData.id}`, dataToSend);
        }

        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "Success!!",
            desc: res.data.message,
          }),
        );

        const refresh = await axiosApi.get("/Users");
        dispatch(setUsers(refresh.data.data));

        setFormData(initialForm);
        onOpenChange(false);
      } catch (error: any) {
        dispatch(
          setMessage({
            view: true,
            type: "Error",
            text: error.response.statusText,
            desc: error.response.data.message,
          }),
        );
      }
    };
    sendData();

    dispatch(setIsLoading(false));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {user
              ? "Actualiza la información del usuario"
              : "Completa los datos para crear un nuevo usuario"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({ ...formData, nombre: e.target.value })
                }
                placeholder="Dr. Juan Pérez"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="juan.perez@vetcare.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.telefono}
                onChange={(e) =>
                  setFormData({ ...formData, telefono: e.target.value })
                }
                placeholder="+506 0000 0000"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.rol}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    rol: value as UserRole,
                  })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.ADMIN}>Administrador</SelectItem>
                  <SelectItem value={UserRole.VET}>Veterinario</SelectItem>
                  <SelectItem value={UserRole.RECEP}>Recepcionista</SelectItem>
                  <SelectItem value={UserRole.ASIST}>Asistente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as User["status"] })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activo">Activo</SelectItem>
                  <SelectItem value="Inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {user ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
