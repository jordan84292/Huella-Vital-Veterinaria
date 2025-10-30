"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Pencil, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AppointmentDialog } from "@/components/appointment-dialog"

type Appointment = {
  id: string
  date: string
  time: string
  patientName: string
  patientId: string
  ownerName: string
  type: "Consulta" | "Vacunación" | "Cirugía" | "Control" | "Emergencia"
  veterinarian: string
  status: "Programada" | "Completada" | "Cancelada"
  notes: string
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    date: "2024-10-30",
    time: "10:00",
    patientName: "Bella",
    patientId: "4",
    ownerName: "Carlos Ruiz",
    type: "Consulta",
    veterinarian: "Dr. Rodriguez",
    status: "Programada",
    notes: "Consulta general de rutina",
  },
  {
    id: "2",
    date: "2024-10-30",
    time: "11:30",
    patientName: "Thor",
    patientId: "5",
    ownerName: "Ana Martínez",
    type: "Vacunación",
    veterinarian: "Dra. González",
    status: "Programada",
    notes: "Vacuna anual",
  },
  {
    id: "3",
    date: "2024-10-30",
    time: "14:00",
    patientName: "Mimi",
    patientId: "6",
    ownerName: "Luis Pérez",
    type: "Control",
    veterinarian: "Dr. Rodriguez",
    status: "Programada",
    notes: "Control post-operatorio",
  },
  {
    id: "4",
    date: "2024-10-31",
    time: "09:00",
    patientName: "Max",
    patientId: "1",
    ownerName: "María González",
    type: "Consulta",
    veterinarian: "Dr. Rodriguez",
    status: "Programada",
    notes: "Revisión general",
  },
]

export default function CitasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const filteredAppointments = appointments.filter(
    (apt) =>
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.veterinarian.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddAppointment = () => {
    setSelectedAppointment(null)
    setDialogOpen(true)
  }

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDialogOpen(true)
  }

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointments(appointments.filter((a) => a.id !== appointmentId))
  }

  const handleSaveAppointment = (appointmentData: Omit<Appointment, "id">) => {
    if (selectedAppointment) {
      setAppointments(appointments.map((a) => (a.id === selectedAppointment.id ? { ...appointmentData, id: a.id } : a)))
    } else {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: (appointments.length + 1).toString(),
      }
      setAppointments([...appointments, newAppointment])
    }
    setDialogOpen(false)
  }

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "Completada":
        return "default"
      case "Cancelada":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getTypeBadge = (type: Appointment["type"]) => {
    switch (type) {
      case "Emergencia":
        return "destructive"
      case "Cirugía":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="p-4 md:ml-64 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Citas</h2>
            <p className="text-sm text-muted-foreground md:text-base">Gestión de citas y consultas</p>
          </div>
          <Button onClick={handleAddAppointment} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Nueva Cita
          </Button>
        </div>

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
              <div className="text-2xl font-bold">{appointments.filter((a) => a.status === "Programada").length}</div>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter((a) => a.status === "Completada").length}</div>
              <p className="text-xs text-muted-foreground">Finalizadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter((a) => a.date === "2024-10-30").length}</div>
              <p className="text-xs text-muted-foreground">Citas programadas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Registro de Citas</CardTitle>
            <CardDescription className="text-sm">Lista completa de citas programadas</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente, propietario, tipo o veterinario..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Fecha</TableHead>
                    <TableHead className="min-w-[80px]">Hora</TableHead>
                    <TableHead className="min-w-[120px]">Paciente</TableHead>
                    <TableHead className="min-w-[140px]">Propietario</TableHead>
                    <TableHead className="min-w-[100px]">Tipo</TableHead>
                    <TableHead className="min-w-[140px]">Veterinario</TableHead>
                    <TableHead className="min-w-[100px]">Estado</TableHead>
                    <TableHead className="text-right min-w-[80px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">
                        {new Date(appointment.date).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="font-medium">{appointment.time}</TableCell>
                      <TableCell className="text-muted-foreground">{appointment.patientName}</TableCell>
                      <TableCell className="text-muted-foreground">{appointment.ownerName}</TableCell>
                      <TableCell>
                        <Badge variant={getTypeBadge(appointment.type)}>{appointment.type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{appointment.veterinarian}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(appointment.status)}>{appointment.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditAppointment(appointment)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteAppointment(appointment.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
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
        onSave={handleSaveAppointment}
      />
    </div>
  )
}
