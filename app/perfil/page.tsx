import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react"

export default function PerfilPage() {
  const user = {
    name: "Dr. Carlos Rodriguez",
    role: "Veterinario",
    email: "carlos.rodriguez@vetcare.com",
    phone: "+34 612 345 678",
    address: "Calle Principal 123, Madrid, España",
    joinDate: "2020-03-15",
    specialization: "Medicina Interna",
    license: "VET-2020-12345",
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="p-4 md:ml-64 md:p-6">
        <div className="mb-4 md:mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Mi Perfil</h2>
          <p className="text-sm text-muted-foreground md:text-base">Información personal y profesional</p>
        </div>

        <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl md:text-3xl">DR</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-semibold md:text-xl">{user.name}</h3>
                <Badge className="mt-2">{user.role}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Información Personal</CardTitle>
              <CardDescription className="text-sm">Datos de contacto y ubicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <Mail className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Correo Electrónico</p>
                  <p className="font-medium truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-medium">{user.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Información Profesional</CardTitle>
              <CardDescription className="text-sm">Datos laborales y credenciales</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <Briefcase className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Especialización</p>
                  <p className="font-medium">{user.specialization}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <Calendar className="h-5 w-5 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
                  <p className="font-medium">{new Date(user.joinDate).toLocaleDateString("es-ES")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Badge variant="outline" className="text-sm">
                  Licencia: {user.license}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
