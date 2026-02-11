"use client";

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
import { Loader2 } from "lucide-react";
import { axiosApi } from "@/app/axiosApi/axiosApi";
import { useDispatch } from "react-redux";
import { setMessage } from "@/Redux/reducers/interfaceReducer";

type Appointment = {
  id: string;
  patientId?: string | number;
  patientName: string;
  ownerName: string;
  date: string;
  time: string;
  type: string;
  veterinarian: string;
  notes?: string;
};

interface AttendAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onSuccess?: () => void;
}

export function AttendAppointmentDialog({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}: AttendAppointmentDialogProps) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    diagnosis: "",
    treatment: "",
    notes: "",
    cost: "",
    nextDoseDate: "",
    nextDoseTime: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment) return;

    setIsLoading(true);
    try {
      const visitData = {
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        notes: formData.notes || "",
        cost: parseFloat(formData.cost) || 0,
        type: appointment.type, // Usar el tipo de la cita original
        date: appointment.date,
        veterinarian: appointment.veterinarian,
      };

      await axiosApi.post(`/appointments/${appointment.id}/attend`, visitData);

   

      // Si es vacunación y se especificó fecha/hora para próxima dosis, crear nueva cita
      if (
        appointment.type === "Vacunación" &&
        formData.nextDoseDate &&
        formData.nextDoseTime
      ) {
        try {
          // Obtener el patientId correcto (puede venir como patientId o patientid)
          const patientId =
            (appointment as any).patientId || (appointment as any).patientid;

      

          const nextAppointment = {
            patientId: patientId,
            date: formData.nextDoseDate,
            time: formData.nextDoseTime,
            type: "Vacunación",
            veterinarian: appointment.veterinarian,
            status: "Programada",
            notes: `Próxima dosis - ${formData.diagnosis}`,
          };

          

          const response = await axiosApi.post(
            "/appointments",
            nextAppointment,
          );



          dispatch(
            setMessage({
              view: true,
              type: "Success",
              text: "Cita atendida y próxima dosis programada",
              desc: `La cita ha sido completada y se programó la próxima dosis para el ${new Date(formData.nextDoseDate + "T00:00:00").toLocaleDateString("es-ES")} a las ${formData.nextDoseTime}.`,
            }),
          );
        } catch (nextAppointmentError: any) {
          // Si falla la creación de la próxima cita, mostrar advertencia pero no fallar
          console.error(
            "Error al programar próxima dosis:",
            nextAppointmentError,
          );
          dispatch(
            setMessage({
              view: true,
              type: "Warning",
              text: "Cita atendida, pero no se pudo programar la próxima dosis",
              desc: "La atención se registró correctamente, pero hubo un error al crear la cita para la próxima dosis. Créela manualmente.",
            }),
          );
        }
      } else {
        dispatch(
          setMessage({
            view: true,
            type: "Success",
            text: "Cita atendida correctamente",
            desc: "La cita ha sido marcada como completada y se ha registrado la visita en la línea de tiempo del paciente.",
          }),
        );
      }

      // Reset form
      setFormData({
        diagnosis: "",
        treatment: "",
        notes: "",
        cost: "",
        nextDoseDate: "",
        nextDoseTime: "",
      });

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Error al atender la cita",
          desc: error.response?.data?.message || error.message,
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Atender Cita</DialogTitle>
          <DialogDescription>
            Registre los detalles de la atención para completar la cita
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Info de la cita */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Paciente</Label>
                <p className="font-medium">{appointment.patientName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Propietario</Label>
                <p className="font-medium">{appointment.ownerName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Fecha</Label>
                <p className="font-medium">
                  {appointment.date
                    ? new Date(
                        appointment.date + "T00:00:00",
                      ).toLocaleDateString("es-ES")
                    : "N/A"}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Hora</Label>
                <p className="font-medium">{appointment.time}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tipo de Cita</Label>
                <p className="font-medium">{appointment.type}</p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="diagnosis">
                  {appointment.type === "Vacunación"
                    ? "Vacuna Aplicada*"
                    : "Diagnóstico*"}
                </Label>
                <Input
                  id="diagnosis"
                  value={formData.diagnosis}
                  onChange={(e) =>
                    setFormData({ ...formData, diagnosis: e.target.value })
                  }
                  placeholder={
                    appointment.type === "Vacunación"
                      ? "Ej: Vacuna antirrábica"
                      : appointment.type === "Cirugía"
                        ? "Ej: Esterilización"
                        : appointment.type === "Control"
                          ? "Ej: Control post-operatorio"
                          : "Ej: Infección respiratoria"
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment">
                  {appointment.type === "Vacunación"
                    ? "Detalles de la Vacuna*"
                    : appointment.type === "Cirugía"
                      ? "Procedimiento Realizado*"
                      : appointment.type === "Control"
                        ? "Evaluación*"
                        : "Tratamiento*"}
                </Label>
                <Textarea
                  id="treatment"
                  value={formData.treatment}
                  onChange={(e) =>
                    setFormData({ ...formData, treatment: e.target.value })
                  }
                  placeholder={
                    appointment.type === "Vacunación"
                      ? "Ej: Dosis única, vía intramuscular"
                      : appointment.type === "Cirugía"
                        ? "Describa el procedimiento quirúrgico realizado"
                        : appointment.type === "Control"
                          ? "Estado del paciente y observaciones"
                          : "Describa el tratamiento aplicado"
                  }
                  rows={3}
                  required
                />
              </div>

              {appointment.type === "Cirugía" && (
                <div className="space-y-2">
                  <Label htmlFor="notes">Cuidados Post-Operatorios*</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Indicaciones para el cuidado post-operatorio"
                    rows={2}
                    required
                  />
                </div>
              )}

              {appointment.type === "Vacunación" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observaciones</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Reacciones observadas o notas adicionales"
                      rows={2}
                    />
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">
                      Programar Próxima Dosis
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nextDoseDate">Fecha</Label>
                        <Input
                          id="nextDoseDate"
                          type="date"
                          value={formData.nextDoseDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nextDoseDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nextDoseTime">Hora</Label>
                        <Input
                          id="nextDoseTime"
                          type="time"
                          value={formData.nextDoseTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nextDoseTime: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Si especifica fecha y hora, se creará automáticamente una
                      cita para la próxima dosis
                    </p>
                  </div>
                </>
              )}

              {appointment.type !== "Cirugía" &&
                appointment.type !== "Vacunación" && (
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas Adicionales</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Observaciones adicionales (opcional)"
                      rows={2}
                    />
                  </div>
                )}

              <div className="space-y-2">
                <Label htmlFor="cost">Costo del Servicio (₡)*</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) =>
                    setFormData({ ...formData, cost: e.target.value })
                  }
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Completar Atención"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
