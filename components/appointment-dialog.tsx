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
          const resPatients = await axiosApi.get("/patients");
          dispatch(setPatients(resPatients.data.data));
        }

        // Cargar clientes si no están en Redux
        if (clients.length === 0) {
          const resClients = await axiosApi.get("/clients");
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

      // Buscar el paciente y su propietario
      const patient = patients.find(
        (p) => String(p.id) === String(appointment.patientId)
      );
      if (patient) {
        setSelectedPatientName(patient.name || "");

        // Buscar el nombre del propietario en la lista de clientes
        const owner = clients.find(
          (c) => String(c.id) === String(patient.ownerId)
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
      (p) => String(p.id) === String(patientId)
    );

    if (selectedPatient) {
      setSelectedPatientName(selectedPatient.name || "");

      // Buscar el nombre del propietario en la lista de clientes usando ownerId
      // Convertir ambos valores a string para la comparación
      const owner = clients.find(
        (c) => String(c.id) === String(selectedPatient.ownerId)
      );

      setOwnerName(owner?.name || "Propietario no encontrado");
    } else {
      setSelectedPatientName("");
      setOwnerName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setIsLoading(true));

    try {
      if (appointment) {
        // Actualizar cita existente
        const res = await axiosApi.put(
          `/appointments/${appointment.id}`,
          formData
        );
        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "Success!!",
            desc: res.data.message,
          })
        );
      } else {
        // Crear nueva cita
        const res = await axiosApi.post("/appointments", formData);
        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "Success!!",
            desc: res.data.message,
          })
        );
      }

      // Refrescar lista de citas
      const refresh = await axiosApi.get("/appointments");
      dispatch(setAppointments(refresh.data.data));

      onOpenChange(false);
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

  // Filtrar solo pacientes activos
  const activePatients = patients.filter((p) => p.status === "Activo");

  // Filtrar solo veterinarios activos
  const veterinarians = users.filter(
    (u) => u.rolName === "Veterinario" && u.status === "Activo"
  );

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
                    // Buscar el nombre del propietario
                    const owner = clients.find(
                      (c) => String(c.id) === String(patient.ownerId)
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
