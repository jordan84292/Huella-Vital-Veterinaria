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

type User = {
  id: string;
  nombre: string;
  email: string;
  rolName: string;
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
  rolName: "4",
  status: "Activo",
};
export function UserDialog({ open, onOpenChange, user }: UserDialogProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    email: "",
    telefono: "",
    rolName: "Asistente" as User["rolName"],
    status: "Activo" as User["status"],
  });

  useEffect(() => {
    if (user) {
      let rol;
      user.rolName == "Administrador"
        ? (rol = "1")
        : user.rolName == "Veterinario"
        ? (rol = "2")
        : user.rolName == "Recepcionista"
        ? (rol = "3")
        : (rol = "4");

      setFormData({
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        telefono: user.telefono,
        rolName: rol,
        status: user.status,
      });
    } else {
      setFormData(initialForm);
    }
  }, [user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setIsLoading(true));
    const sendData = async () => {
      try {
        let res;
        if (!user) {
          res = await axiosApi.post("/users", formData);
        } else {
          res = await axiosApi.put(`/users/${formData.id}`, formData);
        }

        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "Success!!",
            desc: res.data.message,
          })
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
          })
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
                value={formData.rolName}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    rolName: value as User["rolName"],
                  })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Veterinario</SelectItem>
                  <SelectItem value="4">Asistente</SelectItem>
                  <SelectItem value="3">Recepcionista</SelectItem>
                  <SelectItem value="1">Administrador</SelectItem>
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
