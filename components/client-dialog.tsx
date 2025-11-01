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
import {
  setClients,
  setIsLoading,
  setMessage,
} from "@/Redux/reducers/interfaceReducer";
import { axiosApi } from "@/app/axiosApi/axiosApi";
import { useDispatch } from "react-redux";

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  registrationDate: string;
  status: "Activo" | "Inactivo";
};

type ClientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
};
const initialForm = {
  id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  status: "Activo",
};

export function ClientDialog({
  open,
  onOpenChange,
  client,
}: ClientDialogProps) {
  const [formData, setFormData] = useState(initialForm);
  const dispatch = useDispatch();
  useEffect(() => {
    if (client) {
      setFormData({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        city: client.city,
        status: client.status,
      });
    } else {
      setFormData(initialForm);
    }
  }, [client, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    dispatch(setIsLoading(true));
    const sendData = async () => {
      try {
        let res;
        if (!client) {
          res = await axiosApi.post("/clients", formData);
        } else {
          res = await axiosApi.put(`/clients/${formData.id}`, formData);
        }

        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "Success!!",
            desc: res.data.message,
          })
        );

        const refresh = await axiosApi.get("/clients");
        dispatch(setClients(refresh.data.data));

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {client ? "Editar Cliente" : "Nuevo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {client
              ? "Actualiza la información del cliente"
              : "Completa los datos para registrar un nuevo cliente"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {client ? (
              <div className="grid gap-2">
                <Label htmlFor="name">Id</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  placeholder="Cedula"
                  readOnly
                  required
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="name">Id</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  placeholder="Cedula"
                  required
                />
              </div>
            )}
            <div className="grid  gap-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="María González"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="maria@email.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+34 612 345 678"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Calle Mayor 123"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="Madrid"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      status: value as Client["status"],
                    })
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
              {client ? "Guardar Cambios" : "Registrar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
