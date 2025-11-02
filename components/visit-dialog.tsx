"use client";

import type React from "react";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDispatch } from "react-redux";
import {
  setIsLoading,
  setMessage,
  setVisits,
} from "@/Redux/reducers/interfaceReducer";
import { axiosApi } from "@/app/axiosApi/axiosApi";

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
  onSuccess?: () => void; // Callback para recargar datos
};

export function VisitDialog({
  open,
  onOpenChange,
  patientId,
}: VisitDialogProps) {
  const dispatch = useDispatch();
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
      // Obtener visitas del paciente
      const visitsRes = await axiosApi.get(`/visits/patient/${patientId}`);
      dispatch(setVisits(visitsRes.data.data || []));
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Visita</DialogTitle>
          <DialogDescription>
            Registra una nueva consulta o tratamiento
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
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
              <div className="grid gap-2">
                <Label htmlFor="type">Tipo de Visita *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, type: value as Visit["type"] })
                  }
                >
                  <SelectTrigger id="type">
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

            <div className="grid gap-2">
              <Label htmlFor="veterinarian">Veterinario *</Label>
              <Input
                id="veterinarian"
                value={formData.veterinarian}
                onChange={(e) =>
                  setFormData({ ...formData, veterinarian: e.target.value })
                }
                placeholder="Dr. Carlos Rodriguez"
                required
              />
            </div>

            <div className="grid gap-2">
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

            <div className="grid gap-2">
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

            <div className="grid gap-2">
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

            <div className="grid gap-2">
              <Label htmlFor="cost">Costo ($) *</Label>
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
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Registrar Visita</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
