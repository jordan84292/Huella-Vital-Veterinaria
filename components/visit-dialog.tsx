"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDispatch, useSelector } from "react-redux";
import {
  setIsLoading,
  setMessage,
  setVisits,
  setUsers,
} from "@/Redux/reducers/interfaceReducer";
import { axiosApi } from "@/app/axiosApi/axiosApi";
import { RootState } from "@/Redux/store";

type Visit = {
  date: string;
  type: "Consulta" | "Vacunación" | "Cirugía" | "Control" | "Emergencia";
  veterinarian: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  cost: number;
};

type VisitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onSuccess?: () => void;
};

export function VisitDialog({
  open,
  onOpenChange,
  patientId,
}: VisitDialogProps) {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.interface.users);

  const [formData, setFormData] = useState<Visit>({
    date: new Date().toISOString().split("T")[0],
    type: "Consulta",
    veterinarian: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    cost: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setIsLoading(true));

    try {
      const res = await axiosApi.post("/visits", {
        ...formData,
        patientId: patientId,
      });

      dispatch(
        setMessage({
          view: true,
          type: "",
          text: "Visita registrada",
          desc: res.data.message || "La visita se ha registrado correctamente",
        })
      );

      // Obtener visitas del paciente
      const visitsRes = await axiosApi.get(`/visits/patient/${patientId}`);
      dispatch(setVisits(visitsRes.data.data || []));

      // Resetear formulario
      setFormData({
        date: new Date().toISOString().split("T")[0],
        type: "Consulta",
        veterinarian: "",
        diagnosis: "",
        treatment: "",
        notes: "",
        cost: 0,
      });

      onOpenChange(false);
    } catch (error: any) {
      console.log(error);

      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Error al registrar visita",
          desc: error.response?.data?.message || error.message,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Cargar usuarios/veterinarios si no están en Redux
      if (users.length === 0) {
        const resUsers = await axiosApi.get("/users");
        dispatch(setUsers(resUsers.data.data));
      }
    };

    if (open) {
      loadData();
    }
  }, [open, users.length, dispatch]);

  // Filtrar solo veterinarios activos
  const veterinarians = users.filter(
    (u) => u.rolName === "Veterinario" && u.status === "Activo"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Visita</DialogTitle>
          <DialogDescription>
            Registra una nueva consulta o tratamiento
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="type">Tipo de Visita *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as Visit["type"] })
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

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnóstico *</Label>
            <Textarea
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) =>
                setFormData({ ...formData, diagnosis: e.target.value })
              }
              placeholder="Descripción del diagnóstico..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Tratamiento *</Label>
            <Textarea
              id="treatment"
              value={formData.treatment}
              onChange={(e) =>
                setFormData({ ...formData, treatment: e.target.value })
              }
              placeholder="Tratamiento aplicado o prescrito..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Observaciones adicionales..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Costo (₡) *</Label>
            <Input
              id="cost"
              type="number"
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cost: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
              required
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
            <Button type="submit">Registrar Visita</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
