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
  vaccine: string;
  veterinarian: string;
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
    vaccine: "",
    veterinarian: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validaciones frontend
    // Validaciones frontend según reglas del backend
    // Vacuna
    if (
      !formData.vaccine.trim() ||
      formData.vaccine.trim().length < 2 ||
      formData.vaccine.trim().length > 100
    ) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Vacuna requerida",
          desc: "El nombre de la vacuna es obligatorio (2-100 caracteres).",
        }),
      );
      return;
    }
    // Veterinario
    if (
      !formData.veterinarian ||
      formData.veterinarian.trim().length < 2 ||
      formData.veterinarian.trim().length > 150
    ) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Veterinario requerido",
          desc: "Debes seleccionar un veterinario válido (2-150 caracteres).",
        }),
      );
      return;
    }
    // Notas
    if (formData.notes && formData.notes.length > 500) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Notas demasiado largas",
          desc: "Las notas no pueden exceder 500 caracteres.",
        }),
      );
      return;
    }
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
        }),
      );

      // Obtener vacunaciones del paciente
      const vaccinationsRes = await axiosApi.get(
        `/vaccinations/patient/${patientId}`,
      );
      dispatch(setVaccinations(vaccinationsRes.data.data || []));

      // Resetear formulario
      setFormData({
        vaccine: "",
        veterinarian: "",
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
        }),
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

  // Filtrar solo veterinarios (rol === "2")
  // Tipos extendidos para usuarios con cedula
  type User = {
    id: string;
    nombre: string;
    email: string;
    rolName: string;
    status: string;
    telefono: string;
    cedula?: string;
  };
  const veterinarians = users.filter((u: User) => u.rolName === "Veterinario");

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
                      {"cedula" in vet && vet.cedula
                        ? ` - Cédula: ${vet.cedula}`
                        : ""}
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
