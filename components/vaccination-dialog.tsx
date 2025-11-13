"use client";

import type React from "react";
import { useEffect, useState } from "react";
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
  setUsers,
  setVaccinations,
} from "@/Redux/reducers/interfaceReducer";
import { axiosApi } from "@/app/axiosApi/axiosApi";
import { RootState } from "@/Redux/store";

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
  onSuccess?: () => void;
};

export function VaccinationDialog({
  open,
  onOpenChange,
  patientId,
}: VaccinationDialogProps) {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.interface.users);

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
          <DialogTitle>Nueva Vacunación</DialogTitle>
          <DialogDescription>
            Registra una nueva vacuna aplicada
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha de Aplicación *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleDateChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
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

          <div className="grid gap-4 md:grid-cols-2">
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
            <Button type="submit">Registrar Vacuna</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
