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
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreVertical,
  Filter,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentDialog } from "@/components/appointment-dialog";
import { axiosApi } from "../axiosApi/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import {
  setIsLoading,
  setMessage,
  setAppointments,
} from "@/Redux/reducers/interfaceReducer";
import { helpGetDate } from "@/helpers/helpGetDate";

type Appointment = {
  id: string;
  patientId: string;
  date: string;
  time: string;
  patientName: string;
  ownerName: string;
  type: "Consulta" | "Vacunación" | "Cirugía" | "Control" | "Emergencia";
  veterinarian: string;
  status: "Programada" | "Completada" | "Cancelada";
  notes?: string;
};

export default function CitasPage() {
  const dispatch = useDispatch();
  // Cargar pacientes y clientes al montar la página si están vacíos
  const patients = useSelector((state: RootState) => state.interface.patients);
  const clients = useSelector((state: RootState) => state.interface.clients);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (patients.length === 0) {
          const resPatients = await axiosApi.get("/patients");

          dispatch(
            require("@/Redux/reducers/interfaceReducer").setPatients(
              resPatients.data.data,
            ),
          );
        }
        if (clients.length === 0) {
          const resClients = await axiosApi.get("/clients");
          dispatch(
            require("@/Redux/reducers/interfaceReducer").setClients(
              resClients.data.data,
            ),
          );
        }
      } catch (error) {
        console.error("Error cargando pacientes/clientes en citas:", error);
      }
    };
    loadData();
  }, [patients.length, clients.length, dispatch]);
  // (Eliminado: declaración duplicada)
  const appointments = useSelector(
    (state: RootState) => state.interface.appointments,
  );

  // Mapear para agregar patientName y ownerName si no existen
  const mappedAppointments = appointments.map((apt) => {
    // Usar patientid (minúscula) para buscar el paciente
    const patientId = apt.patientId;
    let patientName = apt.patientName;
    let ownerName = apt.ownerName;
    if (!patientName || !ownerName) {
      const patient = patients.find((p) => String(p.id) === String(patientId));
      if (patient) {
        patientName = patient.name;
        // Buscar propietario usando la cédula del paciente
        const owner = clients.find(
          (c) => String(c.cedula) === String(patient.cedula),
        );
        ownerName = owner?.name || "";
      }
    }
    return {
      ...apt,
      patientName: patientName || "",
      ownerName: ownerName || "",
    };
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    const getAppointments = async () => {
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
    getAppointments();
  }, [dispatch]);

  // Función de filtrado
  const filteredAppointments = mappedAppointments.filter((appointment) => {
    const matchesSearch =
      appointment.patientName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.ownerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.veterinarian
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "todos" || appointment.type === typeFilter;

    const matchesStatus =
      statusFilter === "todos" || appointment.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("todos");
    setStatusFilter("todos");
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    searchQuery !== "" || typeFilter !== "todos" || statusFilter !== "todos";

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setDialogOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDialogOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    dispatch(setIsLoading(true));
    const sendData = async () => {
      try {
        const res = await axiosApi.delete(`/appointments/${id}`);

        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "Success!!",
            desc: res.data.message,
          }),
        );

        const refresh = await axiosApi.get("/appointments");
        dispatch(setAppointments(refresh.data.data));
      } catch (error: any) {
        dispatch(
          setMessage({
            view: true,
            type: "Error",
            text: error.response?.statusText || "Error",
            desc: error.response?.data?.message || error.message,
          }),
        );
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    sendData();
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "Completada":
        return "default";
      case "Cancelada":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getTypeBadge = (type: Appointment["type"]) => {
    switch (type) {
      case "Emergencia":
        return "destructive";
      case "Cirugía":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Cálculo de estadísticas
  const totalProgramadas = appointments.filter(
    (a) => a.status === "Programada",
  ).length;
  const totalCompletadas = appointments.filter(
    (a) => a.status === "Completada",
  ).length;
  const today = helpGetDate();
  const totalHoy = appointments.filter(
    (a) => a.date.split("T")[0] == today,
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="p-4 md:ml-64 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Citas
            </h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Gestión de citas y consultas
            </p>
          </div>
          <Button
            onClick={handleAddAppointment}
            className="gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Nueva Cita
          </Button>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="mb-4 grid gap-4 grid-cols-2 lg:grid-cols-4 md:mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Citas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
              <p className="text-xs text-muted-foreground">Registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Programadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProgramadas}</div>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompletadas}</div>
              <p className="text-xs text-muted-foreground">Finalizadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoy}</div>
              <p className="text-xs text-muted-foreground">Citas programadas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Registro de Citas
            </CardTitle>
            <CardDescription className="text-sm">
              Lista completa de citas programadas
            </CardDescription>

            {/* Barra de búsqueda y filtros */}
            <div className="space-y-3 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por paciente, propietario, tipo o veterinario..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {/* Filtro por Tipo */}
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="Consulta">Consulta</SelectItem>
                    <SelectItem value="Vacunación">Vacunación</SelectItem>
                    <SelectItem value="Cirugía">Cirugía</SelectItem>
                    <SelectItem value="Control">Control</SelectItem>
                    <SelectItem value="Emergencia">Emergencia</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filtro por Estado */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los estados</SelectItem>
                    <SelectItem value="Programada">Programada</SelectItem>
                    <SelectItem value="Completada">Completada</SelectItem>
                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>

                {/* Botón para limpiar filtros */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Limpiar filtros
                  </Button>
                )}
              </div>

              {/* Contador de resultados */}
              <p className="text-sm text-muted-foreground">
                Mostrando {filteredAppointments.length} de {appointments.length}{" "}
                citas
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Fecha</TableHead>
                    <TableHead className="min-w-20">Hora</TableHead>
                    <TableHead className="min-w-[120px]">Paciente</TableHead>
                    <TableHead className="min-w-[140px]">Propietario</TableHead>
                    <TableHead className="min-w-[100px]">Tipo</TableHead>
                    <TableHead className="min-w-[140px]">Veterinario</TableHead>
                    <TableHead className="min-w-[100px]">Estado</TableHead>
                    <TableHead className="text-right min-w-20">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.length > 0 ? (
                    filteredAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">
                          {(() => {
                            // Evitar conversión de zona horaria
                            const [year, month, day] = appointment.date
                              .split("T")[0]
                              .split("-");
                            const date = new Date(
                              parseInt(year),
                              parseInt(month) - 1,
                              parseInt(day),
                            );
                            return date.toLocaleDateString("es-ES");
                          })()}
                        </TableCell>
                        <TableCell className="font-medium">
                          {appointment.time}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {appointment.patientName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {appointment.ownerName}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeBadge(appointment.type)}>
                            {appointment.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {appointment.veterinarian}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadge(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEditAppointment(appointment)
                                }
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteAppointment(appointment.id)
                                }
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-muted-foreground">
                          No se encontraron citas con los filtros aplicados
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={selectedAppointment}
      />
    </div>
  );
}
