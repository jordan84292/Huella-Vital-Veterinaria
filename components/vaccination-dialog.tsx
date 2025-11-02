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

import { useDispatch } from "react-redux";
import {
  setIsLoading,
  setMessage,
  setVaccinations,
} from "@/Redux/reducers/interfaceReducer";
import { axiosApi } from "@/app/axiosApi/axiosApi";

type Vaccination = {
  date: string;
  vaccine: string;
  nextDue: string;
  veterinarian: string;
  batchNumber: string;
  notes?: string;
};

type VaccinationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onSuccess?: () => void; // Callback para recargar datos
};

export function VaccinationDialog({
  open,
  onOpenChange,
  patientId,
}: VaccinationDialogProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Vaccination>({
    date: new Date().toISOString().split("T")[0],
    vaccine: "",
    nextDue: "",
    veterinarian: "",
    batchNumber: "",
    notes: "",
  });

  // Calcular fecha de próxima dosis automáticamente (1 año después por defecto)
  const handleDateChange = (date: string) => {
    setFormData({ ...formData, date });
    if (!formData.nextDue) {
      const nextYear = new Date(date);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      setFormData({
        ...formData,
        date,
        nextDue: nextYear.toISOString().split("T")[0],
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setIsLoading(true));

    try {
      const res = await axiosApi.post("/vaccinations", {
        ...formData,
        patientId: patientId,
      });

      dispatch(
        setMessage({
          view: true,
          type: "",
          text: "Vacunación registrada",
          desc:
            res.data.message || "La vacunación se ha registrado correctamente",
        })
      );
      // Obtener vacunaciones del paciente
      const vaccinationsRes = await axiosApi.get(
        `/vaccinations/patient/${patientId}`
      );
      dispatch(setVaccinations(vaccinationsRes.data.data || []));
      // Resetear formulario
      setFormData({
        date: new Date().toISOString().split("T")[0],
        vaccine: "",
        nextDue: "",
        veterinarian: "",
        batchNumber: "",
        notes: "",
      });

      onOpenChange(false);
    } catch (error: any) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Error al registrar vacunación",
          desc: error.response?.data?.message || error.message,
        })
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Vacunación</DialogTitle>
          <DialogDescription>
            Registra una nueva vacuna aplicada
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="vaccine">Vacuna *</Label>
              <Input
                id="vaccine"
                value={formData.vaccine}
                onChange={(e) =>
                  setFormData({ ...formData, vaccine: e.target.value })
                }
                placeholder="Polivalente (DHPP)"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha de Aplicación *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nextDue">Próxima Dosis *</Label>
                <Input
                  id="nextDue"
                  type="date"
                  value={formData.nextDue}
                  onChange={(e) =>
                    setFormData({ ...formData, nextDue: e.target.value })
                  }
                  min={formData.date}
                  required
                />
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
              <Label htmlFor="batchNumber">Número de Lote *</Label>
              <Input
                id="batchNumber"
                value={formData.batchNumber}
                onChange={(e) =>
                  setFormData({ ...formData, batchNumber: e.target.value })
                }
                placeholder="VAC2024-09-001"
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
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Registrar Vacuna</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
