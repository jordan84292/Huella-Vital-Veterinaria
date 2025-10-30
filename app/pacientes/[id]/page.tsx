"use client"
import { useState } from "react"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Calendar, Syringe, Plus } from "lucide-react"
import { VisitDialog } from "@/components/visit-dialog"
import { VaccinationDialog } from "@/components/vaccination-dialog"

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
  birthDate: string
  color: string
  allergies: string[]
}

type Visit = {
  id: string
  date: string
  type: "Consulta" | "Vacunación" | "Cirugía" | "Control" | "Emergencia"
  veterinarian: string
  diagnosis: string
  treatment: string
  notes: string
  cost: number
}

type Vaccination = {
  id: string
  date: string
  vaccine: string
  nextDue: string
  veterinarian: string
  batchNumber: string
}

const mockPatient: Patient = {
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
  birthDate: "2021-05-10",
  color: "Dorado",
  allergies: ["Penicilina"],
}

const mockVisits: Visit[] = [
  {
    id: "1",
    date: "2024-10-15",
    type: "Consulta",
    veterinarian: "Dr. Carlos Rodriguez",
    diagnosis: "Revisión general - Estado saludable",
    treatment: "Ninguno requerido",
    notes: "Paciente en excelente condición. Peso estable.",
    cost: 45.0,
  },
  {
    id: "2",
    date: "2024-09-20",
    type: "Vacunación",
    veterinarian: "Dra. María González",
    diagnosis: "Vacunación anual",
    treatment: "Vacuna polivalente",
    notes: "Sin reacciones adversas",
    cost: 35.0,
  },
  {
    id: "3",
    date: "2024-07-10",
    type: "Control",
    veterinarian: "Dr. Carlos Rodriguez",
    diagnosis: "Control post-operatorio",
    treatment: "Revisión de sutura",
    notes: "Cicatrización correcta. Alta médica.",
    cost: 30.0,
  },
]

const mockVaccinations: Vaccination[] = [
  {
    id: "1",
    date: "2024-09-20",
    vaccine: "Polivalente (DHPP)",
    nextDue: "2025-09-20",
    veterinarian: "Dra. María González",
    batchNumber: "VAC2024-09-001",
  },
  {
    id: "2",
    date: "2024-09-20",
    vaccine: "Rabia",
    nextDue: "2025-09-20",
    veterinarian: "Dra. María González",
    batchNumber: "RAB2024-09-045",
  },
  {
    id: "3",
    date: "2024-03-15",
    vaccine: "Tos de las perreras",
    nextDue: "2025-03-15",
    veterinarian: "Dr. Carlos Rodriguez",
    batchNumber: "TOS2024-03-112",
  },
]

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patientId = params.id
  const [patient] = useState<Patient>(mockPatient)
  const [visits, setVisits] = useState<Visit[]>(mockVisits)
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(mockVaccinations)
  const [visitDialogOpen, setVisitDialogOpen] = useState(false)
  const [vaccinationDialogOpen, setVaccinationDialogOpen] = useState(false)
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null)

  const handleSaveVisit = (visitData: Omit<Visit, "id">) => {
    const newVisit: Visit = {
      ...visitData,
      id: (visits.length + 1).toString(),
    }
    setVisits([newVisit, ...visits])
    setVisitDialogOpen(false)
  }

  const handleSaveVaccination = (vaccinationData: Omit<Vaccination, "id">) => {
    const newVaccination: Vaccination = {
      ...vaccinationData,
      id: (vaccinations.length + 1).toString(),
    }
    setVaccinations([newVaccination, ...vaccinations])
    setVaccinationDialogOpen(false)
  }

  const getVisitTypeBadge = (type: Visit["type"]) => {
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

      <main className="ml-64 p-6">
        <div className="mb-6">
          <Link href="/pacientes">
            <Button variant="ghost" className="mb-4 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver a Pacientes
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">{patient.name}</h2>
              <p className="text-muted-foreground">
                {patient.species} - {patient.breed}
              </p>
            </div>
            <Badge variant={patient.status === "Activo" ? "default" : "secondary"} className="text-sm">
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
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">Microchip</span>
                <span className="text-sm font-medium">{patient.microchip}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">Fecha de Nacimiento</span>
                <span className="text-sm font-medium">{new Date(patient.birthDate).toLocaleDateString("es-ES")}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">Sexo</span>
                <span className="text-sm font-medium">{patient.gender}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">Color</span>
                <span className="text-sm font-medium">{patient.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Última Visita</span>
                <span className="text-sm font-medium">{new Date(patient.lastVisit).toLocaleDateString("es-ES")}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propietario</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">Nombre</span>
                <span className="text-sm font-medium">{patient.ownerName}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-sm text-muted-foreground">ID Cliente</span>
                <span className="text-sm font-medium">{patient.ownerId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Alergias</span>
                <div className="flex gap-1">
                  {patient.allergies.length > 0 ? (
                    patient.allergies.map((allergy, i) => (
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

        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList>
            <TabsTrigger value="timeline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Línea de Tiempo
            </TabsTrigger>
            <TabsTrigger value="visits" className="gap-2">
              <Calendar className="h-4 w-4" />
              Historial de Visitas
            </TabsTrigger>
            <TabsTrigger value="vaccinations" className="gap-2">
              <Syringe className="h-4 w-4" />
              Vacunaciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Línea de Tiempo Médica</CardTitle>
                <CardDescription>Historial completo de eventos médicos del paciente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...visits, ...vaccinations.map((v) => ({ ...v, type: "Vacunación" as const }))]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((event, index) => (
                      <div key={index} className="flex gap-4 border-l-2 border-primary pl-4 pb-4 last:pb-0">
                        <div className="flex-shrink-0 w-24 pt-1">
                          <p className="text-sm font-medium">{new Date(event.date).toLocaleDateString("es-ES")}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <Card className="flex-1">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">
                                {"vaccine" in event ? event.vaccine : event.diagnosis}
                              </CardTitle>
                              <Badge variant={"vaccine" in event ? "outline" : getVisitTypeBadge(event.type)}>
                                {"vaccine" in event ? "Vacunación" : event.type}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-medium">Veterinario:</span>
                              <span>{event.veterinarian}</span>
                            </div>
                            {"treatment" in event && (
                              <>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <span className="font-medium">Tratamiento:</span>
                                  <span>{event.treatment}</span>
                                </div>
                                {event.notes && (
                                  <div className="mt-2 rounded-md bg-muted p-3 text-sm">
                                    <p className="font-medium mb-1">Notas:</p>
                                    <p className="text-muted-foreground">{event.notes}</p>
                                  </div>
                                )}
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <span className="text-sm text-muted-foreground">Costo del servicio</span>
                                  <span className="text-lg font-bold text-primary">{event.cost.toFixed(2)} €</span>
                                </div>
                              </>
                            )}
                            {"nextDue" in event && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium">Próxima dosis:</span>
                                <Badge variant="secondary">{new Date(event.nextDue).toLocaleDateString("es-ES")}</Badge>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visits" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Historial de Visitas</CardTitle>
                    <CardDescription>Registro completo de consultas y tratamientos</CardDescription>
                  </div>
                  <Button onClick={() => setVisitDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Visita
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visits.map((visit) => (
                    <Card key={visit.id} className="overflow-hidden">
                      <CardHeader
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setExpandedVisit(expandedVisit === visit.id ? null : visit.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <CardTitle className="text-base">{visit.diagnosis}</CardTitle>
                              <CardDescription className="mt-1">
                                {new Date(visit.date).toLocaleDateString("es-ES", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={getVisitTypeBadge(visit.type)}>{visit.type}</Badge>
                            <span className="text-lg font-bold text-primary">{visit.cost.toFixed(2)} €</span>
                          </div>
                        </div>
                      </CardHeader>
                      {expandedVisit === visit.id && (
                        <CardContent className="border-t bg-muted/20">
                          <div className="grid gap-4 pt-4 md:grid-cols-2">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm font-medium mb-1">Veterinario</p>
                                <p className="text-sm text-muted-foreground">{visit.veterinarian}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium mb-1">Tratamiento</p>
                                <p className="text-sm text-muted-foreground">{visit.treatment}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-1">Notas Adicionales</p>
                              <div className="rounded-md bg-background p-3">
                                <p className="text-sm text-muted-foreground">{visit.notes}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vaccinations" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Registro de Vacunaciones</CardTitle>
                    <CardDescription>Historial completo de vacunas aplicadas</CardDescription>
                  </div>
                  <Button onClick={() => setVaccinationDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nueva Vacuna
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Vacuna</TableHead>
                      <TableHead>Próxima Dosis</TableHead>
                      <TableHead>Veterinario</TableHead>
                      <TableHead>Lote</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vaccinations.map((vaccination) => (
                      <TableRow key={vaccination.id}>
                        <TableCell className="font-medium">
                          {new Date(vaccination.date).toLocaleDateString("es-ES")}
                        </TableCell>
                        <TableCell className="font-medium">{vaccination.vaccine}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{new Date(vaccination.nextDue).toLocaleDateString("es-ES")}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{vaccination.veterinarian}</TableCell>
                        <TableCell className="text-muted-foreground">{vaccination.batchNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <VisitDialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen} onSave={handleSaveVisit} />
      <VaccinationDialog
        open={vaccinationDialogOpen}
        onOpenChange={setVaccinationDialogOpen}
        onSave={handleSaveVaccination}
      />
    </div>
  )
}
