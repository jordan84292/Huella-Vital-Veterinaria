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

export default function DashboardPage() {
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
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Personal activo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
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
              <div className="text-2xl font-bold">356</div>
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
              <div className="text-2xl font-bold">8</div>
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
              <div className="space-y-4">
                {[
                  {
                    time: "10:00 AM",
                    patient: "Bella (Gato)",
                    owner: "Carlos Ruiz",
                    type: "Consulta general",
                  },
                  {
                    time: "11:30 AM",
                    patient: "Thor (Perro)",
                    owner: "Ana Martínez",
                    type: "Vacunación",
                  },
                  {
                    time: "02:00 PM",
                    patient: "Mimi (Conejo)",
                    owner: "Luis Pérez",
                    type: "Control",
                  },
                  {
                    time: "04:00 PM",
                    patient: "Simba (Gato)",
                    owner: "Laura Torres",
                    type: "Cirugía menor",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 border-b border-border pb-3 last:border-0 last:pb-0 md:gap-3"
                  >
                    <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-semibold text-primary md:w-16">
                      {item.time}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.patient}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.owner}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
