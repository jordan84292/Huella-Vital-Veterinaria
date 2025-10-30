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
import { UserDialog } from "@/components/user-dialog"

type User = {
  id: string
  name: string
  email: string
  role: "Veterinario" | "Asistente" | "Recepcionista" | "Administrador"
  status: "Activo" | "Inactivo"
  phone: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. Carlos Rodriguez",
    email: "carlos.rodriguez@vetcare.com",
    role: "Veterinario",
    status: "Activo",
    phone: "+34 612 345 678",
  },
  {
    id: "2",
    name: "Dra. María González",
    email: "maria.gonzalez@vetcare.com",
    role: "Veterinario",
    status: "Activo",
    phone: "+34 623 456 789",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana.martinez@vetcare.com",
    role: "Asistente",
    status: "Activo",
    phone: "+34 634 567 890",
  },
  {
    id: "4",
    name: "Luis Pérez",
    email: "luis.perez@vetcare.com",
    role: "Recepcionista",
    status: "Activo",
    phone: "+34 645 678 901",
  },
  {
    id: "5",
    name: "Laura Torres",
    email: "laura.torres@vetcare.com",
    role: "Administrador",
    status: "Activo",
    phone: "+34 656 789 012",
  },
]

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddUser = () => {
    setSelectedUser(null)
    setDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setDialogOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
  }

  const handleSaveUser = (userData: Omit<User, "id">) => {
    if (selectedUser) {
      // Edit existing user
      setUsers(users.map((u) => (u.id === selectedUser.id ? { ...userData, id: u.id } : u)))
    } else {
      // Add new user
      const newUser: User = {
        ...userData,
        id: (users.length + 1).toString(),
      }
      setUsers([...users, newUser])
    }
    setDialogOpen(false)
  }

  const getRoleBadgeVariant = (role: User["role"]) => {
    switch (role) {
      case "Veterinario":
        return "default"
      case "Administrador":
        return "secondary"
      case "Asistente":
        return "outline"
      case "Recepcionista":
        return "outline"
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
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Usuarios</h2>
            <p className="text-sm text-muted-foreground md:text-base">Gestión de personal y permisos</p>
          </div>
          <Button onClick={handleAddUser} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">Personal Registrado</CardTitle>
            <CardDescription className="text-sm">Lista completa de usuarios del sistema</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o rol..."
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
                    <TableHead className="min-w-[200px]">Email</TableHead>
                    <TableHead className="min-w-[120px]">Teléfono</TableHead>
                    <TableHead className="min-w-[100px]">Rol</TableHead>
                    <TableHead className="min-w-[80px]">Estado</TableHead>
                    <TableHead className="text-right min-w-[80px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-muted-foreground">{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === "Activo" ? "default" : "secondary"}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive">
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

      <UserDialog open={dialogOpen} onOpenChange={setDialogOpen} user={selectedUser} onSave={handleSaveUser} />
    </div>
  )
}
