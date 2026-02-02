"use client";

import { useEffect, useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Calendar, Clock, FileText, Stethoscope } from "lucide-react";
import { AttendAppointmentDialog } from "@/components/attend-appointment-dialog";
import { axiosApi } from "../axiosApi/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import {
  setIsLoading,
  setMessage,
  setAppointments,
} from "@/Redux/reducers/interfaceReducer";

type Appointment = {
  id: string;
  patientId: string;
  patientName: string;
  ownerName: string;
  species: string;
  date: string;
  time: string;
  type: string;
  veterinarian: string;
  status: "Programada" | "Completada" | "Cancelada";
  notes?: string;
};

export default function AtenderPacientesPage() {
  const dispatch = useDispatch();
  const appointments = useSelector(
    (state: RootState) => state.interface.appointments,
  );
  const currentUser = useSelector((state: RootState) => state.interface.auth);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("Programada");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Cargar citas
  const loadAppointments = async () => {
    dispatch(setIsLoading(true));
    try {
      const res = await axiosApi.get("/appointments");
      dispatch(setAppointments(res.data.data));
    } catch (error: any) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Error al cargar citas",
          desc: error.response?.data?.message || error.message,
        }),
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // Filtrar citas del veterinario logueado
  const filteredAppointments = appointments.filter((appointment: any) => {
    const matchesSearch =
      searchQuery === "" ||
      appointment.patientName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.ownerName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "todos" || appointment.status === statusFilter;

    // Mostrar todas las citas (no filtrar por veterinario aún)
    return matchesSearch && matchesStatus;
  });

  const handleAttendClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAppointment(null);
    loadAppointments(); // Recargar citas después de atender
  };

  // Estadísticas
  const totalProgramadas = appointments.filter(
    (apt: any) => apt.status === "Programada",
  ).length;

  const totalCompletadas = appointments.filter(
    (apt: any) => apt.status === "Completada",
  ).length;

  const totalHoy = appointments.filter((apt: any) => {
    const today = new Date().toISOString().split("T")[0];
    return apt.date === today && apt.status === "Programada";
  }).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="ml-2 sm:ml-64 p-6">
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Atender Pacientes
          </h2>
          <p className="text-muted-foreground">
            Gestiona tus citas asignadas y completa las atenciones
          </p>
        </div>

        {/* Estadísticas */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Citas Programadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProgramadas}</div>
              <p className="text-xs text-muted-foreground">
                Pendientes de atención
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Completadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompletadas}</div>
              <p className="text-xs text-muted-foreground">
                Atenciones realizadas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Citas Hoy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoy}</div>
              <p className="text-xs text-muted-foreground">
                Programadas para hoy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Mis Citas Asignadas</CardTitle>
            <CardDescription>
              Citas que tienes asignadas como veterinario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente o propietario..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="Programada">Programada</SelectItem>
                  <SelectItem value="Completada">Completada</SelectItem>
                  <SelectItem value="Cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabla de citas */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Paciente</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment: any) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">
                          {appointment.date
                            ? new Date(
                                appointment.date + "T00:00:00",
                              ).toLocaleDateString("es-ES")
                            : "N/A"}
                        </TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {appointment.patientName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.species}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {appointment.ownerName}
                        </TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              appointment.status === "Programada"
                                ? "default"
                                : appointment.status === "Completada"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {appointment.status === "Programada" && (
                            <Button
                              size="sm"
                              onClick={() => handleAttendClick(appointment)}
                              className="gap-2"
                            >
                              <FileText className="h-4 w-4" />
                              Atender
                            </Button>
                          )}
                          {appointment.status === "Completada" && (
                            <span className="text-sm text-muted-foreground">
                              Atendida
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground py-8"
                      >
                        No hay citas que coincidan con los filtros
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <AttendAppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={selectedAppointment}
        onSuccess={handleDialogClose}
      />
    </div>
  );
}
