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
  id: number;
  name: string;
  species: "Perro" | "Gato" | "Conejo" | "Ave" | "Otro";
  breed: string;
  age: number;
  weight: number;
  gender: "Macho" | "Hembra" | "Desconocido";
  birthdate: string;
  cedula: string;
  color?: string;
  allergies?: string | null;
  status: "Activo" | "Inactivo";
  created_date?: string;
  updated_date?: string;
  ownerName?: string;
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
    weight: 0,
    gender: "Macho" as Patient["gender"],
    birthDate: "",
    ownerId: "",
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
      // Validar y ajustar peso
      let safeWeight = patient.weight;
      if (!safeWeight || safeWeight <= 0) {
        safeWeight = 0.1;
      }

      // Formatear fecha de nacimiento a yyyy-MM-dd
      let birthDateRaw = patient.birthdate || "";
      let birthDateFormatted = "";
      if (birthDateRaw) {
        // Si la fecha viene en formato ISO, extraer solo la parte de la fecha
        if (birthDateRaw.includes("T")) {
          birthDateFormatted = birthDateRaw.split("T")[0];
        } else {
          const d = new Date(birthDateRaw + "T00:00:00");
          if (!isNaN(d.getTime())) {
            birthDateFormatted = d.toISOString().slice(0, 10);
          }
        }
      }

      setFormData({
        name: patient.name,
        species: patient.species,
        breed: patient.breed,
        weight: safeWeight,
        gender: patient.gender,
        birthDate: birthDateFormatted,
        ownerId: patient.cedula || "",
        color: patient.color || "",
        allergies: patient.allergies || "",
        status: patient.status,
      });
    } else {
      setFormData({
        name: "",
        species: "Perro",
        breed: "",
        weight: 0.1,
        gender: "Macho",
        birthDate: "",
        ownerId: "",
        color: "",
        allergies: "",
        status: "Activo",
      });
    }
  }, [patient, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones frontend para evitar errores en el backend
    // Validaciones frontend según reglas del backend
    // Nombre: 2-100 caracteres
    if (
      !formData.name.trim() ||
      formData.name.trim().length < 2 ||
      formData.name.trim().length > 100
    ) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Nombre requerido",
          desc: "El nombre del paciente es obligatorio (2-100 caracteres).",
        }),
      );
      return;
    }
    // Especie: 2-50 caracteres, solo letras y espacios
    if (
      !formData.species ||
      formData.species.trim().length < 2 ||
      formData.species.trim().length > 50
    ) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Especie requerida",
          desc: "La especie es obligatoria (2-50 caracteres).",
        }),
      );
      return;
    }
    if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(formData.species)) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Especie inválida",
          desc: "La especie solo puede contener letras y espacios.",
        }),
      );
      return;
    }
    // Raza: 2-100 caracteres
    if (
      !formData.breed.trim() ||
      formData.breed.trim().length < 2 ||
      formData.breed.trim().length > 100
    ) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Raza requerida",
          desc: "La raza es obligatoria (2-100 caracteres).",
        }),
      );
      return;
    }
    // Peso: 0-1000
    if (!formData.weight || formData.weight <= 0 || formData.weight > 1000) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Peso requerido",
          desc: "El peso debe ser mayor a 0 y menor o igual a 1000 kg.",
        }),
      );
      return;
    }
    // Género: debe ser Macho, Hembra o Desconocido
    if (
      !formData.gender ||
      !["Macho", "Hembra", "Desconocido"].includes(formData.gender)
    ) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Sexo requerido",
          desc: "El sexo es obligatorio y debe ser válido.",
        }),
      );
      return;
    }
    // Fecha de nacimiento: no puede ser futura
    if (formData.birthDate && new Date(formData.birthDate) > new Date()) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Fecha inválida",
          desc: "La fecha de nacimiento no puede ser futura.",
        }),
      );
      return;
    }
    // Cédula del propietario: 6-12 dígitos
    if (!formData.ownerId || !/^\d{6,12}$/.test(formData.ownerId)) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Propietario requerido",
          desc: "Debes seleccionar un propietario con cédula válida (6-12 dígitos).",
        }),
      );
      return;
    }
    // Color: opcional, 2-50 caracteres
    if (
      formData.color &&
      (formData.color.trim().length < 2 || formData.color.trim().length > 50)
    ) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Color inválido",
          desc: "El color debe tener entre 2 y 50 caracteres.",
        }),
      );
      return;
    }
    // Alergias: opcional, max 500 caracteres
    if (formData.allergies && formData.allergies.length > 500) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Alergias demasiado largas",
          desc: "Las alergias no pueden exceder 500 caracteres.",
        }),
      );
      return;
    }
    // Estado: debe ser Activo o Inactivo
    if (formData.status && !["Activo", "Inactivo"].includes(formData.status)) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Estado inválido",
          desc: "El estado debe ser Activo o Inactivo.",
        }),
      );
      return;
    }
    // Fin validaciones

    dispatch(setIsLoading(true));

    try {
      // Calcular la edad en años y meses
      let calculatedAge = 0;
      let ageLabel = "años";
      if (formData.birthDate) {
        const today = new Date();
        const birth = new Date(formData.birthDate);
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        if (today.getDate() < birth.getDate()) {
          months--;
        }
        if (months < 0) {
          years--;
          months += 12;
        }
        if (years < 2) {
          calculatedAge = years * 12 + months;
          ageLabel = "meses";
        } else {
          calculatedAge = years;
          ageLabel = "años";
        }
      }
      const dataToSend = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: calculatedAge,
        weight: formData.weight,
        gender: formData.gender,
        cedula: formData.ownerId, // Ahora se envía como cedula
        status: formData.status,
        ...(formData.birthDate && { birthdate: formData.birthDate }),
        ...(formData.color && { color: formData.color }),
        ...(formData.allergies && { allergies: formData.allergies }),
        ageLabel,
      };

      let res;

      if (patient) {
        // Log de los datos que se enviarán al backend al actualizar paciente

        // Actualizar paciente existente (PUT)
        res = await axiosApi.put(`/patients/${patient.id}`, dataToSend);
        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "¡Actualización exitosa!",
            desc: res.data.message || "Paciente actualizado correctamente",
          }),
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
          }),
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
        }),
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
                    disabled={!!patient}
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
                  <Label htmlFor="age">Edad</Label>
                  <Input
                    id="age"
                    type="text"
                    value={(() => {
                      // Usar birthDate de formData, si no, birthDate de patient
                      const birthDateValue =
                        formData.birthDate || (patient && patient.birthdate);
                      if (!birthDateValue) return "";
                      const today = new Date();
                      const birth = new Date(birthDateValue);
                      let years = today.getFullYear() - birth.getFullYear();
                      let months = today.getMonth() - birth.getMonth();
                      if (today.getDate() < birth.getDate()) {
                        months--;
                      }
                      if (months < 0) {
                        years--;
                        months += 12;
                      }
                      if (years < 2) {
                        return `${years * 12 + months} meses`;
                      } else {
                        return `${years} años`;
                      }
                    })()}
                    readOnly
                    placeholder="Calculado automáticamente"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="weight">
                    Peso (kg) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0.1"
                    max="1000"
                    step="0.1"
                    value={formData.weight === 0 ? "" : formData.weight}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Permitir borrar el campo
                      if (value === "") {
                        setFormData({ ...formData, weight: 0 });
                        return;
                      }
                      // Permitir coma o punto como separador decimal
                      value = value.replace(",", ".");
                      if (isNaN(Number(value))) {
                        setFormData({ ...formData, weight: 0 });
                        dispatch(
                          setMessage({
                            view: true,
                            type: "Error",
                            text: "Peso inválido",
                            desc: "El peso debe ser un número válido.",
                          }),
                        );
                        return;
                      }
                      setFormData({
                        ...formData,
                        weight: Number.parseFloat(value),
                      });
                    }}
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
                    disabled={!!patient}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="text"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    placeholder="Café con blanco"
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
                  Propietario <span className="text-destructive">*</span>
                </Label>
                {patient ? (
                  <Input
                    id="ownerId"
                    value={formData.ownerId || "Sin propietario"}
                    readOnly
                    disabled
                    className="bg-muted text-muted-foreground"
                  />
                ) : (
                  <Select
                    value={formData.ownerId}
                    onValueChange={(value) => {
                      const selectedClient = clients.find(
                        (c) => c.cedula == value,
                      );
                      setFormData({
                        ...formData,
                        ownerId: selectedClient?.cedula || value,
                      });
                    }}
                    required
                  >
                    <SelectTrigger id="ownerId">
                      <SelectValue placeholder="Selecciona un propietario" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.filter(
                        (c: any) => c.cedula && c.cedula.trim() !== "",
                      ).length === 0 ? (
                        <SelectItem value="none" disabled>
                          No hay clientes con cédula disponible
                        </SelectItem>
                      ) : (
                        clients
                          .filter(
                            (client) =>
                              (client as any).cedula &&
                              (client as any).cedula.trim() !== "",
                          )
                          .map((client) => (
                            <SelectItem
                              key={(client as any).cedula}
                              value={(client as any).cedula}
                            >
                              {client.name} - {client.email} (
                              {(client as any).cedula})
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
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
