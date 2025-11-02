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
import { Textarea } from "@/components/ui/textarea";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import {
  setIsLoading,
  setMessage,
  setPatients,
  setClients,
} from "@/Redux/reducers/interfaceReducer";
import { axiosApi } from "@/app/axiosApi/axiosApi";

type Patient = {
  id: string;
  name: string;
  species: "Perro" | "Gato" | "Conejo" | "Ave" | "Otro";
  breed: string;
  age: number;
  weight: number;
  gender: "Macho" | "Hembra" | "Desconocido";
  birthDate?: string;
  ownerName: string;
  ownerId: string;
  nextVisit?: string;
  lastVisit?: string;
  microchip?: string;
  color?: string;
  allergies?: string;
  status: "Activo" | "Inactivo";
};

type PatientDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
};

export function PatientDialog({
  open,
  onOpenChange,
  patient,
}: PatientDialogProps) {
  const dispatch = useDispatch();
  const clients = useSelector((state: RootState) => state.interface.clients);

  const [formData, setFormData] = useState({
    name: "",
    species: "Perro" as Patient["species"],
    breed: "",
    age: 0,
    weight: 0,
    gender: "Macho" as Patient["gender"],
    birthDate: "",
    ownerId: "",
    lastVisit: "",
    nextVisit: "",
    microchip: "",
    color: "",
    allergies: "",
    status: "Activo" as Patient["status"],
  });

  // Cargar clientes al abrir el diálogo
  useEffect(() => {
    if (open && clients.length === 0) {
      const loadClients = async () => {
        try {
          const res = await axiosApi.get("/clients");
          dispatch(setClients(res.data.data));
        } catch (error) {
          console.error("Error al cargar clientes:", error);
        }
      };
      loadClients();
    }
  }, [open, clients.length, dispatch]);

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        species: patient.species,
        breed: patient.breed,
        age: patient.age,
        weight: patient.weight,
        gender: patient.gender,
        birthDate: patient.birthDate || "",
        ownerId: patient.ownerId,
        lastVisit: patient.lastVisit || "",
        nextVisit: patient.nextVisit || "",
        microchip: patient.microchip || "",
        color: patient.color || "",
        allergies: patient.allergies || "",
        status: patient.status,
      });
    } else {
      setFormData({
        name: "",
        species: "Perro",
        breed: "",
        age: 0,
        weight: 0,
        gender: "Macho",
        birthDate: "",
        ownerId: "",
        lastVisit: "",
        nextVisit: "",
        microchip: "",
        color: "",
        allergies: "",
        status: "Activo",
      });
    }
  }, [patient, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setIsLoading(true));

    try {
      // Preparar datos para enviar (remover campos vacíos opcionales)
      const dataToSend = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: formData.age,
        weight: formData.weight,
        gender: formData.gender,
        ownerId: formData.ownerId,
        status: formData.status,
        ...(formData.birthDate && { birthDate: formData.birthDate }),
        ...(formData.lastVisit && { lastVisit: formData.lastVisit }),
        ...(formData.nextVisit && { nextVisit: formData.nextVisit }),
        ...(formData.microchip && { microchip: formData.microchip }),
        ...(formData.color && { color: formData.color }),
        ...(formData.allergies && { allergies: formData.allergies }),
      };

      let res;

      if (patient) {
        // Actualizar paciente existente (PUT)
        res = await axiosApi.put(`/patients/${patient.id}`, dataToSend);
        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "¡Actualización exitosa!",
            desc: res.data.message || "Paciente actualizado correctamente",
          })
        );
      } else {
        // Crear nuevo paciente (POST)
        res = await axiosApi.post("/patients", dataToSend);
        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "¡Registro exitoso!",
            desc: res.data.message || "Paciente creado correctamente",
          })
        );
      }

      // Refrescar lista de pacientes
      const refresh = await axiosApi.get("/patients");
      dispatch(setPatients(refresh.data.data));

      // Cerrar el diálogo
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error al guardar paciente:", error);
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: error.response?.statusText || "Error",
          desc:
            error.response?.data?.message ||
            error.message ||
            "Error al guardar el paciente",
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {patient ? "Editar Paciente" : "Nuevo Paciente"}
          </DialogTitle>
          <DialogDescription>
            {patient
              ? "Actualiza la información del paciente"
              : "Completa los datos para registrar un nuevo paciente"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Información Básica */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Información Básica
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">
                    Nombre <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Max"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="species">
                    Especie <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.species}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        species: value as Patient["species"],
                      })
                    }
                  >
                    <SelectTrigger id="species">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Perro">Perro</SelectItem>
                      <SelectItem value="Gato">Gato</SelectItem>
                      <SelectItem value="Conejo">Conejo</SelectItem>
                      <SelectItem value="Ave">Ave</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="breed">
                    Raza <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="breed"
                    value={formData.breed}
                    onChange={(e) =>
                      setFormData({ ...formData, breed: e.target.value })
                    }
                    placeholder="Golden Retriever"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gender">
                    Sexo <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        gender: value as Patient["gender"],
                      })
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Macho">Macho</SelectItem>
                      <SelectItem value="Hembra">Hembra</SelectItem>
                      <SelectItem value="Desconocido">Desconocido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="age">
                    Edad (años) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        age: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="weight">
                    Peso (kg) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    max="1000"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weight: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="Café con blanco"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="microchip">Microchip</Label>
                  <Input
                    id="microchip"
                    value={formData.microchip}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        microchip: e.target.value.toUpperCase(),
                      })
                    }
                    placeholder="982000123456789"
                    maxLength={20}
                  />
                </div>
              </div>
            </div>

            {/* Información del Propietario */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Propietario
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="ownerId">
                  Seleccionar Propietario{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.ownerId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, ownerId: value })
                  }
                  required
                >
                  <SelectTrigger id="ownerId">
                    <SelectValue placeholder="Selecciona un propietario" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No hay clientes disponibles
                      </SelectItem>
                    ) : (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.email}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {formData.ownerId && (
                  <p className="text-sm font-bold">
                    Propietario seleccionado:
                    <span className="text-[#053D58]">
                      {" "}
                      {clients.find((c) => c.id == formData.ownerId)?.name}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Información Médica */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Información Médica
              </h3>
              <div className="grid gap-2">
                <Label htmlFor="allergies">Alergias</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      allergies: e.target.value,
                    })
                  }
                  placeholder="Penicilina, Polen..."
                  rows={3}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground">
                  Máximo 500 caracteres
                </p>
              </div>
            </div>

            {/* Visitas */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Control de Visitas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="lastVisit">Última Visita</Label>
                  <Input
                    id="lastVisit"
                    type="date"
                    value={formData.lastVisit}
                    onChange={(e) =>
                      setFormData({ ...formData, lastVisit: e.target.value })
                    }
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nextVisit">Próxima Visita</Label>
                  <Input
                    id="nextVisit"
                    type="date"
                    value={formData.nextVisit}
                    onChange={(e) =>
                      setFormData({ ...formData, nextVisit: e.target.value })
                    }
                    min={
                      formData.lastVisit ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                </div>
              </div>
            </div>

            {/* Estado */}
            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as Patient["status"],
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {patient ? "Guardar Cambios" : "Registrar Paciente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
