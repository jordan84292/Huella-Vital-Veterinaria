"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, Pencil, Trash2, MoreVertical, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ClientDialog } from "@/components/client-dialog"

type Client = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  petsCount: number
  registrationDate: string
  status: "Activo" | "Inactivo"
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+34 612 345 678",
    address: "Calle Mayor 123",
    city: "Madrid",
    postalCode: "28001",
    petsCount: 2,
    registrationDate: "2024-01-15",
    status: "Activo",
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    email: "carlos.ruiz@email.com",
    phone: "+34 623 456 789",
    address: "Avenida Libertad 45",
    city: "Barcelona",
    postalCode: "08001",
    petsCount: 1,
    registrationDate: "2024-02-20",
    status: "Activo",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana.martinez@email.com",
    phone: "+34 634 567 890",
    address: "Plaza España 7",
    city: "Valencia",
    postalCode: "46001",
    petsCount: 3,
    registrationDate: "2024-03-10",
    status: "Activo",
  },
  {
    id: "4",
    name: "Luis Pérez",
    email: "luis.perez@email.com",
    phone: "+34 645 678 901",
    address: "Calle Sol 89",
    city: "Sevilla",
    postalCode: "41001",
    petsCount: 1,
    registrationDate: "2024-04-05",
    status: "Activo",
  },
  {
    id: "5",
    name: "Laura Torres",
    email: "laura.torres@email.com",
    phone: "+34 656 789 012",
    address: "Avenida Constitución 34",
    city: "Bilbao",
    postalCode: "48001",
    petsCount: 2,
    registrationDate: "2024-05-12",
    status: "Inactivo",
  },
]

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.city.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddClient = () => {
    setSelectedClient(null)
    setDialogOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setSelectedClient(client)
    setDialogOpen(true)
  }

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter((c) => c.id !== clientId))
  }

  const handleSaveClient = (clientData: Omit<Client, "id" | "registrationDate">) => {
    if (selectedClient) {
      // Edit existing client
      setClients(
        clients.map((c) =>
          c.id === selectedClient.id ? { ...clientData, id: c.id, registrationDate: c.registrationDate } : c,
        ),
      )
    } else {
      // Add new client
      const newClient: Client = {
        ...clientData,
        id: (clients.length + 1).toString(),
        registrationDate: new Date().toISOString().split("T")[0],
      }
      setClients([...clients, newClient])
    }
    setDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="p-4 md:ml-64 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Clientes</h2>
            <p className="text-sm text-muted-foreground md:text-base">Registro de propietarios de mascotas</p>
          </div>
          <Button onClick={handleAddClient} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>

        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">Propietarios registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.filter((c) => c.status === "Activo").length}</div>
              <p className="text-xs text-muted-foreground">Con mascotas activas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Mascotas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.reduce((sum, c) => sum + c.petsCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Pacientes registrados</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Registro de Clientes</CardTitle>
            <CardDescription className="text-sm">Lista completa de propietarios</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email, teléfono o ciudad..."
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
                    <TableHead className="min-w-[150px]">Nombre</TableHead>
                    <TableHead className="min-w-[180px]">Contacto</TableHead>
                    <TableHead className="min-w-[120px]">Ubicación</TableHead>
                    <TableHead className="min-w-[100px]">Mascotas</TableHead>
                    <TableHead className="min-w-[120px]">Fecha Registro</TableHead>
                    <TableHead className="min-w-[80px]">Estado</TableHead>
                    <TableHead className="text-right min-w-[80px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-muted-foreground">{client.email}</span>
                          <span className="text-sm text-muted-foreground">{client.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">{client.city}</span>
                          <span className="text-xs text-muted-foreground">{client.postalCode}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{client.petsCount} mascota(s)</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(client.registrationDate).toLocaleDateString("es-ES")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={client.status === "Activo" ? "default" : "secondary"}>{client.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClient(client)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClient(client.id)}
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

      <ClientDialog open={dialogOpen} onOpenChange={setDialogOpen} client={selectedClient} onSave={handleSaveClient} />
    </div>
  )
}
