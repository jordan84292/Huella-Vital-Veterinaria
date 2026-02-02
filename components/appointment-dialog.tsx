"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import {
  setIsLoading,
  setMessage,
  setAppointments,
  setPatients,
  setClients,
  setUsers,
} from "@/Redux/reducers/interfaceReducer";
import { axiosApi } from "@/app/axiosApi/axiosApi";

type Appointment = {
  id: string;
  patientId: string;
  date: string;
  time: string;
  patientName?: string;
  ownerName?: string;
  type: "Consulta" | "Vacunación" | "Cirugía" | "Control" | "Emergencia";
  veterinarian: string;
  status: "Programada" | "Completada" | "Cancelada";
  notes?: string;
};

type AppointmentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
};

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
}: AppointmentDialogProps) {
  // Obtener la fecha de hoy en formato YYYY-MM-DD
  // Estado para mostrar errores del backend
  const [backendError, setBackendError] = useState<string>("");
  const todayStr = new Date().toISOString().split("T")[0];
  const patients = useSelector((state: RootState) => state.interface.patients);
  const clients = useSelector((state: RootState) => state.interface.clients);
  const users = useSelector((state: RootState) => state.interface.users);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    patientId: "",
    date: "",
    time: "",
    type: "Consulta" as Appointment["type"],
    veterinarian: "",
    status: "Programada" as Appointment["status"],
    notes: "",
  });

  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [ownerName, setOwnerName] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar pacientes si no están en Redux
        if (patients.length === 0) {
          const resPatients = await axiosApi.get("/patients?limit=1000");
          dispatch(setPatients(resPatients.data.data));
        }

        // Cargar clientes si no están en Redux
        if (clients.length === 0) {
          const resClients = await axiosApi.get("/clients?limit=1000");
          dispatch(setClients(resClients.data.data));
        }

        // Cargar usuarios/veterinarios si no están en Redux
        if (users.length === 0) {
          const resUsers = await axiosApi.get("/users");
          dispatch(setUsers(resUsers.data.data));
        }
      } catch (error: any) {
        console.error("Error loading data:", error);
      }
    };

    if (open) {
      loadData();
    }
  }, [open, patients.length, clients.length, users.length, dispatch]);

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId,
        date: appointment.date,
        time: appointment.time,
        type: appointment.type,
        veterinarian: appointment.veterinarian,
        status: appointment.status,
        notes: appointment.notes || "",
      });

      // Debug: mostrar cómo se busca el paciente y propietario
      const patient = patients.find(
        (p: any) => String(p.id) === String(appointment.patientId),
      );

      if (patient) {
        setSelectedPatientName(patient.name || "");

        const owner = clients.find(
          (c: any) =>
            c.cedula &&
            patient.cedula &&
            String(c.cedula) === String(patient.cedula),
        );

        setOwnerName(owner?.name || "");
      }
    } else {
      setFormData({
        patientId: "",
        date: "",
        time: "",
        type: "Consulta",
        veterinarian: "",
        status: "Programada",
        notes: "",
      });
      setSelectedPatientName("");
      setOwnerName("");
    }
  }, [appointment, open, patients]);

  // Manejar cambio de paciente
  const handlePatientChange = (patientId: string) => {
    setFormData({ ...formData, patientId });

    // Buscar el paciente seleccionado y actualizar información del propietario
    // Convertir ambos valores a string para la comparación
    const selectedPatient = patients.find(
      (p: any) => String(p.id) === String(patientId),
    );

    if (selectedPatient) {
      setSelectedPatientName(selectedPatient.name || "");

      // Buscar el nombre del propietario en la lista de clientes usando cedula
      const owner = clients.find(
        (c: any) =>
          c.cedula &&
          selectedPatient.cedula &&
          String(c.cedula) === String(selectedPatient.cedula),
      );
      setOwnerName(owner?.name || "Propietario no encontrado");
    } else {
      setSelectedPatientName("");
      setOwnerName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBackendError("");
    // Validaciones frontend según reglas del backend
    // Paciente
    if (
      !formData.patientId ||
      isNaN(Number(formData.patientId)) ||
      Number(formData.patientId) < 1
    ) {
      setBackendError(
        "El ID del paciente es requerido y debe ser un número positivo.",
      );
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Paciente inválido",
          desc: "El ID del paciente es requerido y debe ser un número positivo.",
        }),
      );
      return;
    }
    // Fecha
    if (!formData.date || isNaN(Date.parse(formData.date))) {
      setBackendError("La fecha es requerida y debe ser válida.");
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Fecha inválida",
          desc: "La fecha es requerida y debe ser válida.",
        }),
      );
      return;
    }
    // Hora
    if (
      !formData.time ||
      !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.time)
    ) {
      setBackendError("La hora es requerida y debe estar en formato HH:MM.");
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Hora inválida",
          desc: "La hora es requerida y debe estar en formato HH:MM.",
        }),
      );
      return;
    }
    // Tipo
    const tiposValidos = [
      "Consulta",
      "Vacunación",
      "Cirugía",
      "Control",
      "Emergencia",
    ];
    if (!formData.type || !tiposValidos.includes(formData.type)) {
      setBackendError("El tipo de cita es requerido y debe ser válido.");
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Tipo inválido",
          desc: "El tipo de cita es requerido y debe ser válido.",
        }),
      );
      return;
    }
    // Veterinario
    if (
      !formData.veterinarian ||
      formData.veterinarian.trim().length < 2 ||
      formData.veterinarian.trim().length > 255
    ) {
      setBackendError("El veterinario es requerido (2-255 caracteres).");
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Veterinario inválido",
          desc: "El veterinario es requerido (2-255 caracteres).",
        }),
      );
      return;
    }
    // Estado
    const estadosValidos = ["Programada", "Completada", "Cancelada"];
    if (formData.status && !estadosValidos.includes(formData.status)) {
      setBackendError("El estado no es válido.");
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Estado inválido",
          desc: "El estado no es válido.",
        }),
      );
      return;
    }
    // Notas
    if (formData.notes && typeof formData.notes !== "string") {
      setBackendError("Las notas deben ser texto.");
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Notas inválidas",
          desc: "Las notas deben ser texto.",
        }),
      );
      return;
    }
    dispatch(setIsLoading(true));

    try {
      let res;
      if (appointment) {
        // Actualizar cita existente
        res = await axiosApi.put(`/appointments/${appointment.id}`, formData);
      } else {
        // Crear nueva cita
        res = await axiosApi.post("/appointments", formData);
      }

      // Si el backend devuelve error, mostrarlo
      if (res.data && res.data.error) {
        setBackendError(res.data.error);
        dispatch(
          setMessage({
            view: true,
            type: "Error",
            text: "Error",
            desc: res.data.error,
          }),
        );
        return;
      }

      dispatch(
        setMessage({
          view: true,
          type: "",
          text: "Success!!",
          desc: res.data.message,
        }),
      );

      // Refrescar lista de citas
      const refresh = await axiosApi.get("/appointments");
      dispatch(setAppointments(refresh.data.data));

      onOpenChange(false);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Error desconocido";
      setBackendError(errorMsg);
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: error.response?.statusText || "Error",
          desc: errorMsg,
        }),
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  // Filtrar solo pacientes activos
  const activePatients = patients.filter((p) => p.status === "Activo");

  // Filtrar solo veterinarios (rol === "2" o rol === 2)
  const veterinarians = users.filter((u) => String(u.rol) === "2");
  console.log("Total usuarios:", users.length);
  console.log("Veterinarios encontrados:", veterinarians.length);
  console.log("Veterinarios:", veterinarians);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Editar Cita" : "Nueva Cita"}
          </DialogTitle>
          <DialogDescription>
            {appointment
              ? "Modifica los datos de la cita"
              : "Registra una nueva cita en el sistema"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {backendError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2">
              <strong>Error:</strong> {backendError}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="patientId">Paciente *</Label>
            <Select
              value={formData.patientId}
              onValueChange={handlePatientChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un paciente" />
              </SelectTrigger>
              <SelectContent>
                {activePatients.length > 0 ? (
                  activePatients.map((patient) => {
                    // Buscar el nombre del propietario usando cedula
                    const owner = clients.find(
                      (c: any) =>
                        c.cedula &&
                        patient.cedula &&
                        String(c.cedula) === String(patient.cedula),
                    );
                    const ownerName = owner?.name || "Sin propietario";

                    return (
                      <SelectItem key={patient.id} value={String(patient.id)}>
                        {patient.name} - {patient.species} ({ownerName})
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="no-patients" disabled>
                    No hay pacientes disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedPatientName && ownerName && (
              <p className="text-sm text-muted-foreground mt-2">
                <span className="font-medium">Paciente seleccionado:</span>{" "}
                {selectedPatientName} |{" "}
                <span className="font-medium">Propietario:</span> {ownerName}
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                min={todayStr}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Cita *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Consulta">Consulta</SelectItem>
                  <SelectItem value="Vacunación">Vacunación</SelectItem>
                  <SelectItem value="Cirugía">Cirugía</SelectItem>
                  <SelectItem value="Control">Control</SelectItem>
                  <SelectItem value="Emergencia">Emergencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="veterinarian">Veterinario *</Label>
              <Select
                value={formData.veterinarian}
                onValueChange={(value) =>
                  setFormData({ ...formData, veterinarian: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un veterinario" />
                </SelectTrigger>
                <SelectContent>
                  {veterinarians.length > 0 ? (
                    veterinarians.map((vet) => (
                      <SelectItem key={vet.id} value={vet.nombre}>
                        Dr(a). {vet.nombre}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-vets" disabled>
                      No hay veterinarios disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Programada">Programada</SelectItem>
                <SelectItem value="Completada">Completada</SelectItem>
                <SelectItem value="Cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {appointment ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
