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
import { validateClient } from "@/lib/validations";

type Client = {
  id: string;
  cedula?: string; // Añadir cedula como ID real
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  registrationdate: string;
  status: "Activo" | "Inactivo";
};

type ClientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
};
const initialForm = {
  id: undefined as string | undefined,
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
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const dispatch = useDispatch();
  useEffect(() => {
    if (client) {
      setFormData({
        id: client.cedula || client.id || "", // Usar cedula como ID principal
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
    // Limpiar errores de validación cuando se abre el diálogo
    setValidationErrors({});
  }, [client, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar datos en el frontend antes de enviar
    const validation = validateClient({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      cedula: formData.id,
      status: formData.status,
    });

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Errores de validación",
          desc: "Por favor corrige los errores en el formulario antes de continuar",
        }),
      );
      return;
    }

    // Limpiar errores si la validación es exitosa
    setValidationErrors({});

    dispatch(setIsLoading(true));
    const sendData = async () => {
      try {
        let res;
        if (!client) {
          res = await axiosApi.post("/clients", formData);
        } else {
          // Para actualizar, necesitamos usar la cédula como ID
          const clientId = formData.id || client?.cedula || client?.id;

          if (!clientId || isNaN(Number(clientId))) {
            dispatch(
              setMessage({
                view: true,
                type: "Error",
                text: "Error de validación",
                desc: "ID de cliente no válido. No se puede actualizar. Verifica que la cédula sea un número válido.",
              }),
            );
            dispatch(setIsLoading(false));
            return;
          }

          console.log(`Actualizando cliente con ID/Cédula: ${clientId}`);
          res = await axiosApi.put(`/clients/${clientId}`, {
            ...formData,
            cedula: clientId, // Asegurar que se envíe la cédula
          });
        }

        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "Success!!",
            desc: res.data.message,
          }),
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
          }),
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
                  placeholder="Cédula"
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
                  placeholder="Cédula"
                  className={validationErrors.cedula ? "border-red-500" : ""}
                  required
                />
                {validationErrors.cedula && (
                  <p className="text-sm text-red-500">
                    {validationErrors.cedula}
                  </p>
                )}
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
                className={validationErrors.name ? "border-red-500" : ""}
                required
              />
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
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
                  className={validationErrors.email ? "border-red-500" : ""}
                  required
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500">
                    {validationErrors.email}
                  </p>
                )}
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
                  placeholder="+506 0000-0000"
                  className={validationErrors.phone ? "border-red-500" : ""}
                  required
                />
                {validationErrors.phone && (
                  <p className="text-sm text-red-500">
                    {validationErrors.phone}
                  </p>
                )}
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
                className={validationErrors.address ? "border-red-500" : ""}
                required
              />
              {validationErrors.address && (
                <p className="text-sm text-red-500">
                  {validationErrors.address}
                </p>
              )}
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
                  placeholder="Alajuela"
                  className={validationErrors.city ? "border-red-500" : ""}
                  required
                />
                {validationErrors.city && (
                  <p className="text-sm text-red-500">
                    {validationErrors.city}
                  </p>
                )}
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
                  <SelectTrigger
                    id="status"
                    className={validationErrors.status ? "border-red-500" : ""}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                {validationErrors.status && (
                  <p className="text-sm text-red-500">
                    {validationErrors.status}
                  </p>
                )}
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
