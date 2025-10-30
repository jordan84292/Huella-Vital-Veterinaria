"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Pencil, Trash2, MoreVertical, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { PatientDialog } from "@/components/patient-dialog"

type Patient = {
  id: string
  name: string
  species: "Perro" | "Gato" | "Conejo" | "Ave" | "Otro"
  breed: string
  age: number
  weight: number
  gender: "Macho" | "Hembra"
  ownerName: string
  ownerId: string
  microchip: string
  status: "Activo" | "Inactivo"
  lastVisit: string
  nextVisit: string
}

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Max",
    species: "Perro",
    breed: "Golden Retriever",
    age: 3,
    weight: 28.5,
    gender: "Macho",
    ownerName: "María González",
    ownerId: "1",
    microchip: "982000123456789",
    status: "Activo",
    lastVisit: "2024-10-15",
    nextVisit: "2024-11-15",
  },
  {
    id: "2",
    name: "Luna",
    species: "Gato",
    breed: "Siamés",
    age: 2,
    weight: 4.2,
    gender: "Hembra",
    ownerName: "Carlos Ruiz",
    ownerId: "2",
    microchip: "982000987654321",
    status: "Activo",
    lastVisit: "2024-10-20",
    nextVisit: "2024-11-20",
  },
  {
    id: "3",
    name: "Rocky",
    species: "Perro",
    breed: "Pastor Alemán",
    age: 5,
    weight: 35.0,
    gender: "Macho",
    ownerName: "Ana Martínez",
    ownerId: "3",
    microchip: "982000456789123",
    status: "Activo",
    lastVisit: "2024-10-18",
    nextVisit: "2024-12-18",
  },
  {
    id: "4",
    name: "Bella",
    species: "Gato",
    breed: "Persa",
    age: 4,
    weight: 5.1,
    gender: "Hembra",
    ownerName: "Luis Pérez",
    ownerId: "4",
    microchip: "982000789123456",
    status: "Activo",
    lastVisit: "2024-10-22",
    nextVisit: "2024-10-30",
  },
  {
    id: "5",
    name: "Thor",
    species: "Perro",
    breed: "Husky Siberiano",
    age: 2,
    weight: 24.8,
    gender: "Macho",
    ownerName: "Laura Torres",
    ownerId: "5",
    microchip: "982000321654987",
    status: "Activo",
    lastVisit: "2024-10-10",
    nextVisit: "2024-11-10",
  },
]

export default function PacientesPage() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.microchip.includes(searchQuery),
  )

  const handleAddPatient = () => {
    setSelectedPatient(null)
    setDialogOpen(true)
  }

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient)
    setDialogOpen(true)
  }

  const handleDeletePatient = (patientId: string) => {
    setPatients(patients.filter((p) => p.id !== patientId))
  }

  const handleSavePatient = (patientData: Omit<Patient, "id">) => {
    if (selectedPatient) {
      setPatients(patients.map((p) => (p.id === selectedPatient.id ? { ...patientData, id: p.id } : p)))
    } else {
      const newPatient: Patient = {
        ...patientData,
        id: (patients.length + 1).toString(),
      }
      setPatients([...patients, newPatient])
    }
    setDialogOpen(false)
  }

  const getSpeciesBadgeVariant = (species: Patient["species"]) => {
    switch (species) {
      case "Perro":
        return "default"
      case "Gato":
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
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Pacientes</h2>
            <p className="text-sm text-muted-foreground md:text-base">Registro de mascotas y animales</p>
          </div>
          <Button onClick={handleAddPatient} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Nuevo Paciente
          </Button>
        </div>

        <div className="mb-4 grid gap-4 grid-cols-2 lg:grid-cols-4 md:mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground">Mascotas registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Perros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.filter((p) => p.species === "Perro").length}</div>
              <p className="text-xs text-muted-foreground">Caninos activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Gatos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{patients.filter((p) => p.species === "Gato").length}</div>
              <p className="text-xs text-muted-foreground">Felinos activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Otros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {patients.filter((p) => p.species !== "Perro" && p.species !== "Gato").length}
              </div>
              <p className="text-xs text-muted-foreground">Otras especies</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Registro de Pacientes</CardTitle>
            <CardDescription className="text-sm">Lista completa de mascotas</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, especie, raza, propietario o microchip..."
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
                    <TableHead className="min-w-[120px]">Nombre</TableHead>
                    <TableHead className="min-w-[140px]">Especie / Raza</TableHead>
                    <TableHead className="min-w-[80px]">Edad</TableHead>
                    <TableHead className="min-w-[80px]">Peso</TableHead>
                    <TableHead className="min-w-[140px]">Propietario</TableHead>
                    <TableHead className="min-w-[120px]">Última Visita</TableHead>
                    <TableHead className="min-w-[120px]">Próxima Visita</TableHead>
                    <TableHead className="min-w-[80px]">Estado</TableHead>
                    <TableHead className="text-right min-w-[80px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={getSpeciesBadgeVariant(patient.species)} className="w-fit">
                            {patient.species}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{patient.breed}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{patient.age} años</TableCell>
                      <TableCell className="text-muted-foreground">{patient.weight} kg</TableCell>
                      <TableCell className="text-muted-foreground">{patient.ownerName}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(patient.lastVisit).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(patient.nextVisit).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={patient.status === "Activo" ? "default" : "secondary"}>{patient.status}</Badge>
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
                            <DropdownMenuItem onClick={() => handleEditPatient(patient)}>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <PatientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patient={selectedPatient}
        onSave={handleSavePatient}
      />
    </div>
  )
}
