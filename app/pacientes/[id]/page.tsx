"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import {
  setIsLoading,
  setMessage,
  setVaccinations,
  setVisits,
} from "@/Redux/reducers/interfaceReducer";
import { axiosApi } from "@/app/axiosApi/axiosApi";
import { RootState } from "@/Redux/store";

type Patient = {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight: number;
  gender: string;
  ownerName?: string;
  ownerId: string;
  microchip?: string;
  status: string;
  cedula?: string;
  birthDate?: string;
  color?: string;
  allergies?: string;
};

type Visit = {
  id: string;
  patientId: string;
  date: string;
  type: "Consulta" | "Vacunación" | "Cirugía" | "Control" | "Emergencia";
  veterinarian: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  cost: number;
};

type Vaccination = {
  id: string;
  patientId: string;
  created_date: string;
  vaccine: string;
  veterinarian: string;
  notes?: string;
};

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  const dispatch = useDispatch();

  const [patient, setPatient] = useState<Patient | null>(null);
  const visits = useSelector((state: RootState) => state.interface.visits);
  const vaccinations = useSelector(
    (state: RootState) => state.interface.vaccinations,
  );
  const [lastVisit, setLastVisit] = useState<any>(null);
  const [nextAppointment, setNextAppointment] = useState<any>(null);

  // Cargar datos del paciente
  const fetchPatientData = async () => {
    dispatch(setIsLoading(true));
    try {
      // Obtener datos del paciente
      const patientRes = await axiosApi.get(`/patients/${patientId}`);
      setPatient(patientRes.data.data);

      // Obtener visitas del paciente (y la última visita y próxima cita)
      const visitsRes = await axiosApi.get(`/visits/patient/${patientId}`);
      dispatch(setVisits(visitsRes.data.data || []));

      // Obtener última visita y próxima cita (nuevo endpoint)
      const summaryRes = await axiosApi
        .get(`/visits/patient/${patientId}/summary`)
        .catch(() => null);
      if (summaryRes && summaryRes.data) {
        setLastVisit(summaryRes.data.lastVisit || null);
        setNextAppointment(summaryRes.data.nextAppointment || null);
      } else {
        setLastVisit(null);
        setNextAppointment(null);
      }

      // Obtener vacunaciones del paciente
      const vaccinationsRes = await axiosApi.get(
        `/vaccinations/patient/${patientId}`,
      );
      dispatch(setVaccinations(vaccinationsRes.data.data || []));
    } catch (error: any) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Error al cargar datos del paciente",
          desc: error.response?.data?.message || error.message,
        }),
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  // Función para obtener el badge variant según el tipo de visita
  const getVisitTypeBadge = (
    type: Visit["type"],
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "Emergencia":
        return "destructive";
      case "Cirugía":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const allergies = (() => {
    try {
      if (typeof patient.allergies === "string") {
        const arrayAllergies = patient.allergies.split(",");
        return arrayAllergies;
      }
      return patient.allergies || [];
    } catch {
      return [];
    }
  })();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="ml-2 sm:ml-64 p-6">
        <div className="mb-6">
          <Link href="/pacientes">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Pacientes
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {patient.name}
              </h2>
              <p className="text-muted-foreground">
                {patient.species} - {patient.breed}
              </p>
            </div>
            <Badge
              variant={patient.status === "Activo" ? "default" : "secondary"}
              className="text-sm"
            >
              {patient.status}
            </Badge>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Edad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patient.age}</div>
              <p className="text-xs text-muted-foreground">años</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Peso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patient.weight}</div>
              <p className="text-xs text-muted-foreground">kg</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Visitas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{visits.length}</div>
              <p className="text-xs text-muted-foreground">registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Vacunas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vaccinations.length}</div>
              <p className="text-xs text-muted-foreground">aplicadas</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.microchip && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-sm text-muted-foreground">
                    Microchip
                  </span>
                  <span className="text-sm font-medium">
                    {patient.microchip}
                  </span>
                </div>
              )}
              {patient.birthDate && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-sm text-muted-foreground">
                    Fecha de Nacimiento
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(
                      patient.birthDate + "T00:00:00",
                    ).toLocaleDateString("es-ES")}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">Sexo</span>
                <span className="text-sm font-medium">{patient.gender}</span>
              </div>
              {patient.color && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-sm text-muted-foreground">Color</span>
                  <span className="text-sm font-medium">{patient.color}</span>
                </div>
              )}
              {lastVisit && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Última Visita
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(lastVisit.date + "T00:00:00").toLocaleDateString(
                      "es-ES",
                    )}
                  </span>
                </div>
              )}
              {nextAppointment && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Próxima Cita
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(
                      nextAppointment.date + "T00:00:00",
                    ).toLocaleDateString("es-ES")}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propietario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {patient.name && (
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-sm text-muted-foreground">Nombre</span>
                  <span className="text-sm font-medium">{"Jordan"}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">
                  ID Propietario
                </span>
                <span className="text-sm font-medium">{patient.cedula}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Alergias</span>
                <div className="flex gap-1 flex-wrap justify-end">
                  {allergies.length > 0 ? (
                    allergies.map((allergy: string, i: number) => (
                      <Badge key={i} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm font-medium">Ninguna</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Línea de Tiempo Médica</CardTitle>
            <CardDescription>
              Historial completo de eventos médicos del paciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                const allEvents = [
                  ...visits.map((v) => ({
                    ...v,
                    eventType: "visit" as const,
                    date: v.date, // Asegurar campo date
                  })),
                  ...vaccinations.map((v) => ({
                    ...v,
                    eventType: "vaccination" as const,
                    date: v.created_date, // Normalizar a campo date
                  })),
                ];

                const filteredEvents = allEvents.filter((event) => {
                  // Filtrar eventos sin fecha válida antes de ordenar
                  if (!event.date) return false;
                  // No agregar T00:00:00 si la fecha ya lo tiene
                  const dateStr = event.date.includes("T")
                    ? event.date
                    : event.date + "T00:00:00";
                  const testDate = new Date(dateStr);
                  return !isNaN(testDate.getTime());
                });

                return filteredEvents
                  .sort((a, b) => {
                    const dateA =
                      a.date && a.date.includes("T")
                        ? a.date
                        : a.date
                          ? a.date + "T00:00:00"
                          : "1970-01-01T00:00:00";
                    const dateB =
                      b.date && b.date.includes("T")
                        ? b.date
                        : b.date
                          ? b.date + "T00:00:00"
                          : "1970-01-01T00:00:00";
                    return (
                      new Date(dateB).getTime() - new Date(dateA).getTime()
                    );
                  })
                  .map((event) => {
                    const dateStr =
                      event.date && event.date.includes("T")
                        ? event.date
                        : event.date + "T00:00:00";
                    const eventDate = new Date(dateStr);

                    return (
                      <div
                        key={`${event.eventType}-${event.id}`}
                        className="flex gap-4 border-l-2 border-primary pl-4 pb-4 last:pb-0"
                      >
                        <div className="shrink-0 w-24 pt-1">
                          <p className="text-sm font-medium">
                            {eventDate.toLocaleDateString("es-ES")}
                          </p>
                        </div>
                        <Card className="flex-1">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">
                                {event.eventType === "vaccination"
                                  ? (event as Vaccination).vaccine
                                  : (event as Visit).diagnosis}
                              </CardTitle>
                              <Badge
                                variant={
                                  event.eventType === "vaccination"
                                    ? "outline"
                                    : getVisitTypeBadge((event as Visit).type)
                                }
                              >
                                {event.eventType === "vaccination"
                                  ? "Vacunación"
                                  : (event as Visit).type}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-medium">Veterinario:</span>
                              <span>{event.veterinarian}</span>
                            </div>
                            {event.eventType === "visit" && (
                              <>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span className="font-medium">
                                    Tratamiento:
                                  </span>
                                  <span>{(event as Visit).treatment}</span>
                                </div>
                                {(event as Visit).notes && (
                                  <div className="mt-2 rounded-md bg-muted p-3 text-sm">
                                    <p className="font-medium mb-1">Notas:</p>
                                    <p className="text-muted-foreground">
                                      {(event as Visit).notes}
                                    </p>
                                  </div>
                                )}
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <span className="text-sm text-muted-foreground">
                                    Costo del servicio
                                  </span>
                                  <span className="text-lg font-bold text-primary">
                                    ₡{Number((event as Visit).cost).toFixed(2)}
                                  </span>
                                </div>
                              </>
                            )}
                            {event.eventType === "vaccination" && (
                              <>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="font-medium">
                                    Fecha dosis:
                                  </span>
                                  <Badge variant="secondary">
                                    {eventDate.toLocaleDateString("es-ES")}
                                  </Badge>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    );
                  });
              })()}
              {visits.length === 0 && vaccinations.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No hay eventos registrados
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
