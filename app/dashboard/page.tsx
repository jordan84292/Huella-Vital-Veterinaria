"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, UserPlus, PawPrint, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import {
  setAuth,
  setIsLoading,
  setMessage,
} from "@/Redux/reducers/interfaceReducer";
import { axiosApi } from "../axiosApi/axiosApi";
import { deleteAuthCookie, getAuthCookie } from "@/lib/auth/cookies";
import { helpGetDate } from "@/helpers/helpGetDate";

interface DashboardStats {
  totalUsers: number;
  totalClients: number;
  totalPatients: number;
  todayAppointments: number;
}

interface TodayAppointment {
  patientId: string;
  time: string;
  Paciente: string;
  species: string;
  ownerName: string;
  type: string;
  date: string;
  status: string;
  veterinarian: string;
}

export default function DashboardPage() {
  const dispatch = useDispatch();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalClients: 0,
    totalPatients: 0,
    todayAppointments: 0,
  });
  const [todayAppointments, setTodayAppointments] = useState<
    TodayAppointment[]
  >([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      dispatch(setIsLoading(true));
      try {
        // Obtener estadísticas de usuarios
        const usersStats = await axiosApi.get("/users/stats");

        // Obtener estadísticas de clientes
        const clientsStats = await axiosApi.get("/clients/stats");

        // Obtener estadísticas de pacientes
        const patientsStats = await axiosApi.get("/patients/stats");

        // Obtener citas de hoy
        const today = helpGetDate(); // Formato: YYYY-MM-DD

        const appointmentsToday = await axiosApi.get(
          `/appointments/date/${today}`,
        );

        // Actualizar estadísticas
        setStats({
          totalUsers: usersStats.data.data.totalUsers || 0,
          totalClients: clientsStats.data.data.totalClients || 0,
          totalPatients: patientsStats.data.data.totalPatients || 0,
          todayAppointments: appointmentsToday.data.data.length || 0,
        });

        // Formatear y ordenar citas de hoy
        const appointmentsArray = Array.isArray(appointmentsToday.data?.data)
          ? appointmentsToday.data.data
          : [];
        const formattedAppointments = appointmentsArray
          .map((apt: any) => ({
            id: apt.id,
            date: apt.date, // Asegurarse de que la fecha esté correctamente asignada
            time: apt.time,
            type: apt.type,
            veterinarian: apt.veterinarian, // Veterinario
            status: apt.status, // Estado
            patientName: apt.patientName || "Sin nombre",
            species: apt.species || "Sin especie",
            ownerName: apt.ownerName || "Sin propietario",
          }))
          .sort((a: any, b: any) => {
            // Ordenar por hora
            return a.time.localeCompare(b.time);
          })
          .slice(0, 4); // Mostrar solo las primeras 4 citas

        setTodayAppointments(formattedAppointments);
      } catch (error: any) {
        dispatch(
          setMessage({
            view: true,
            type: "Error",
            text: "Error al cargar dashboard",
            desc: error.response?.data?.message || error.message,
          }),
        );
      } finally {
        dispatch(setIsLoading(false));
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  // Función para formatear la hora (de 24h a 12h AM/PM)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="p-4 md:ml-64 md:p-6">
        <div className="mb-4 md:mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Dashboard
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            Resumen general del sistema
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 md:gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Usuarios
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Personal activo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                Propietarios registrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                Mascotas en sistema
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.todayAppointments}
              </div>
              <p className="text-xs text-muted-foreground">Programadas</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 md:mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg md:text-xl">
                    Próximas Citas
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Consultas programadas para hoy
                  </CardDescription>
                </div>
                <Link href="/citas">
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 border-b border-border pb-3 last:border-0 last:pb-0 md:gap-3"
                    >
                      <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary md:w-16">
                        {formatTime(item.time)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground truncate">
                          <strong> Fecha:</strong> {item.date}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          <strong> Estado:</strong> {item.status}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          <strong> Tipo:</strong> {item.type}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          <strong> Veterinario:</strong> {item.veterinarian}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No hay citas programadas para hoy
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
