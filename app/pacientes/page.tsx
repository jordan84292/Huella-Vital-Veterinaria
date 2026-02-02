"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  Eye,
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
import { PatientDialog } from "@/components/patient-dialog";
import { axiosApi } from "../axiosApi/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import {
  setIsLoading,
  setMessage,
  setPatients,
} from "@/Redux/reducers/interfaceReducer";

type Patient = {
  id: number;
  name: string;
  species: "Perro" | "Gato" | "Conejo" | "Ave" | "Otro";
  breed: string;
  age: number;
  weight: number;
  gender: "Macho" | "Hembra";
  birthdate: string; // Cambio a birthdate (minúscula) para consistencia
  ownerName: string;
  ownerId: string;
  nextVisit?: string;
  lastVisit?: string;
  microchip?: string;
  color?: string;
  allergies?: string;
  status: "Activo" | "Inactivo";
  cedula: string;
};

export default function PacientesPage() {
  const patients = useSelector((state: RootState) => state.interface.patients);
  const visits = useSelector(
    (state: RootState) => state.interface.visits || [],
  );
  const appointments = useSelector(
    (state: RootState) => state.interface.appointments || [],
  );
  const clients = useSelector(
    (state: RootState) => state.interface.clients || [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const dispatch = useDispatch();

  // Enriquecer pacientes con última visita, próxima cita y nombre de propietario (usando campos reales)
  const patientsWithVisits = patients.map((patient) => {
    // Buscar visitas del paciente (usando patientid)
    const patientVisits = visits.filter(
      (v: any) => String(v.patientid) === String(patient.id),
    );

    // Buscar citas completadas del paciente (usando patientid)
    const patientCompletedAppointments = appointments.filter(
      (a: any) =>
        String(a.patientid) === String(patient.id) && a.status === "Completada",
    );

    // Combinar visitas y citas completadas para obtener la más reciente
    const allVisits = [
      ...patientVisits.map((v: any) => ({ date: v.date, source: "visit" })),
      ...patientCompletedAppointments.map((a: any) => ({
        date: a.date,
        source: "appointment",
      })),
    ];

    const lastVisit =
      allVisits.length > 0
        ? allVisits.reduce((latest: any, curr: any) =>
            new Date(
              curr.date.includes("T") ? curr.date : curr.date + "T00:00:00",
            ) >
            new Date(
              latest.date.includes("T")
                ? latest.date
                : latest.date + "T00:00:00",
            )
              ? curr
              : latest,
          ).date
        : undefined;

    // Buscar citas futuras del paciente y obtener la más próxima (usando patientid, solo programadas)
    const now = new Date();
    const patientAppointments = appointments.filter(
      (a: any) =>
        String(a.patientid) === String(patient.id) &&
        new Date(a.date + "T00:00:00") > now &&
        a.status === "Programada",
    );
    const nextAppointment =
      patientAppointments.length > 0
        ? patientAppointments.reduce((soonest: any, curr: any) =>
            new Date(curr.date + "T00:00:00") <
            new Date(soonest.date + "T00:00:00")
              ? curr
              : soonest,
          ).date
        : undefined;

    // Buscar nombre del propietario por cedula
    let ownerName = patient.ownerName;
    if ((!ownerName || ownerName === "") && patient.cedula) {
      const client = clients.find(
        (c: any) => String(c.cedula) === String(patient.cedula),
      );
      if (client && client.name) {
        ownerName = client.name;
      }
    }

    return {
      ...patient,
      lastVisit,
      nextVisit: nextAppointment,
      ownerName,
    };
  });

  useEffect(() => {
    const getAllData = async () => {
      dispatch(setIsLoading(true));
      try {
        const [patientsRes, visitsRes, appointmentsRes, clientsRes] =
          await Promise.all([
            axiosApi.get("/patients"),
            axiosApi.get("/visits"),
            axiosApi.get("/appointments"),
            axiosApi.get("/clients"),
          ]);
        dispatch(setPatients(patientsRes.data.data));
        dispatch({ type: "interface/setVisits", payload: visitsRes.data.data });
        dispatch({
          type: "interface/setAppointments",
          payload: appointmentsRes.data.data,
        });
        dispatch({
          type: "interface/setClients",
          payload: clientsRes.data.data,
        });
      } catch (error: any) {
        dispatch(
          setMessage({
            view: true,
            type: "Error",
            text: "Error al cargar datos",
            desc: error.response?.data?.message || error.message,
          }),
        );
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    getAllData();
  }, [dispatch]);

  // Función de filtrado
  const filteredPatients = patientsWithVisits.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.microchip?.includes(searchQuery) ?? false);

    const matchesSpecies =
      speciesFilter === "todos" || patient.species === speciesFilter;

    const matchesStatus =
      statusFilter === "todos" || patient.status === statusFilter;

    return matchesSearch && matchesSpecies && matchesStatus;
  });

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSearchQuery("");
    setSpeciesFilter("todos");
    setStatusFilter("todos");
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    searchQuery !== "" || speciesFilter !== "todos" || statusFilter !== "todos";

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setDialogOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
  };

  const handleDeletePatient = (id: string) => {
    dispatch(setIsLoading(true));
    const sendData = async () => {
      try {
        const res = await axiosApi.delete(`/patients/${id}`);

        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "Success!!",
            desc: res.data.message,
          }),
        );

        const refresh = await axiosApi.get("/patients");
        dispatch(setPatients(refresh.data.data));
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

  const getSpeciesBadgeVariant = (species: Patient["species"]) => {
    switch (species) {
      case "Perro":
        return "default";
      case "Gato":
        return "secondary";
      default:
        return "outline";
    }
  };

  // Cálculo de estadísticas
  const totalPerros = patients.filter((p) => p.species === "Perro").length;
  const totalGatos = patients.filter((p) => p.species === "Gato").length;
  const totalOtros = patients.filter(
    (p) => p.species !== "Perro" && p.species !== "Gato",
  ).length;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="p-4 md:ml-64 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Pacientes
            </h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Registro de mascotas y animales
            </p>
          </div>
          <Button onClick={handleAddPatient} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Nuevo Paciente
          </Button>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="mb-4 grid gap-4 grid-cols-2 lg:grid-cols-4 md:mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Pacientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground">
                Mascotas registradas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Perros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPerros}</div>
              <p className="text-xs text-muted-foreground">Caninos activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Gatos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGatos}</div>
              <p className="text-xs text-muted-foreground">Felinos activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Otros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOtros}</div>
              <p className="text-xs text-muted-foreground">Otras especies</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Registro de Pacientes
            </CardTitle>
            <CardDescription className="text-sm">
              Lista completa de mascotas
            </CardDescription>

            {/* Barra de búsqueda y filtros */}
            <div className="space-y-3 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, raza, propietario o microchip..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {/* Filtro por Especie */}
                <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por especie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las especies</SelectItem>
                    <SelectItem value="Perro">Perro</SelectItem>
                    <SelectItem value="Gato">Gato</SelectItem>
                    <SelectItem value="Conejo">Conejo</SelectItem>
                    <SelectItem value="Ave">Ave</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
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
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="Inactivo">Inactivo</SelectItem>
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
                Mostrando {filteredPatients.length} de {patients.length}{" "}
                pacientes
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Nombre</TableHead>
                    <TableHead className="min-w-[140px]">
                      Especie / Raza
                    </TableHead>
                    <TableHead className="min-w-20">Edad</TableHead>
                    <TableHead className="min-w-20">Peso</TableHead>
                    <TableHead className="min-w-[140px]">Propietario</TableHead>
                    <TableHead className="min-w-[120px]">
                      Última Visita
                    </TableHead>
                    <TableHead className="min-w-[120px]">
                      Próxima Visita
                    </TableHead>
                    <TableHead className="min-w-20">Estado</TableHead>
                    <TableHead className="text-right min-w-20">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">
                          {patient.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant={getSpeciesBadgeVariant(patient.species)}
                              className="w-fit"
                            >
                              {patient.species}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {patient.breed}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {patient.age} años
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {patient.weight} kg
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {patient.ownerName}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {(() => {
                            if (!patient.lastVisit) return "N/A";
                            const dateStr = patient.lastVisit.includes("T")
                              ? patient.lastVisit
                              : patient.lastVisit + "T00:00:00";
                            const date = new Date(dateStr);
                            return isNaN(date.getTime())
                              ? "N/A"
                              : date.toLocaleDateString("es-ES");
                          })()}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {(() => {
                            if (!patient.nextVisit) return "N/A";
                            const dateStr = patient.nextVisit.includes("T")
                              ? patient.nextVisit
                              : patient.nextVisit + "T00:00:00";
                            const date = new Date(dateStr);
                            return isNaN(date.getTime())
                              ? "N/A"
                              : date.toLocaleDateString("es-ES");
                          })()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              patient.status === "Activo"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {patient.status}
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
                              <DropdownMenuItem asChild>
                                <Link href={`/pacientes/${patient.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver Historial
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  // Crear un nuevo objeto con cedula garantizada
                                  const patientWithCedula: Patient = {
                                    ...patient,
                                    id: Number(patient.id),
                                    cedula: patient.cedula || "",
                                    birthdate: patient.birthdate || "",
                                  };
                                  handleEditPatient(patientWithCedula);
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeletePatient(patient.id)}
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
                      <TableCell colSpan={9} className="text-center py-8">
                        <p className="text-muted-foreground">
                          No se encontraron pacientes con los filtros aplicados
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

      <PatientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patient={
          selectedPatient
            ? {
                ...selectedPatient,
                birthdate: selectedPatient.birthdate || "",
              }
            : null
        }
      />
    </div>
  );
}
