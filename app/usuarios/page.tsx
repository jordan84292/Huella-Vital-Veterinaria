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
import {
  UserDialog,
  UserRole,
  NumberToUserRole,
} from "@/components/user-dialog";
import { axiosApi } from "../axiosApi/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import {
  setIsLoading,
  setMessage,
  setUsers,
} from "@/Redux/reducers/interfaceReducer";

import type { User } from "@/components/user-dialog";

// Se mapean los roles a los números correspondientes
// Mapeo de códigos de rol a nombres legibles
const ROLES: Record<string, string> = {
  "1": "Administrador",
  "2": "Veterinario",
  "3": "Recepcionista",
  "4": "Asistente",
  "5": "Cliente", // Agregar rol Cliente
};

export default function UsuariosPage() {
  const users = useSelector((state: RootState) => state.interface.users);
  const currentUser = useSelector((state: RootState) => state.interface.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [rolFilter, setRolFilter] = useState<string>("todos");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUsers = async () => {
      const res = await axiosApi.get("/users");
      dispatch(setUsers(res.data.data));
    };
    getUsers();
  }, []);

  // Función de filtrado
  const filteredUsers = users.filter((user) => {
    // Filtro de búsqueda por texto
    const matchesSearch =
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.telefono.includes(searchQuery);

    // Filtro por rol (usa el código de rol)
    const matchesRol = rolFilter === "todos" || user.rol === rolFilter;

    // Filtro por estado
    const matchesStatus =
      statusFilter === "todos" || user.status === statusFilter;

    return matchesSearch && matchesRol && matchesStatus;
  });

  // Función para limpiar todos los filtros
  const clearFilters = () => {
    setSearchQuery("");
    setRolFilter("todos");
    setStatusFilter("todos");
  };

  // Verificar si hay filtros activos
  const hasActiveFilters =
    searchQuery !== "" || rolFilter !== "todos" || statusFilter !== "todos";

  const handleAddUser = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEditUser = (user: any) => {
    // No permitir editar usuarios con rol Cliente (5)
    if (user.rol === "5") {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Acción no permitida",
          desc: "Los usuarios tipo Cliente no se pueden editar desde aquí. Edítalos desde la sección de Clientes.",
        }),
      );
      return;
    }
    // Convertir rol a UserRole para el diálogo
    setSelectedUser({ ...user, rol: NumberToUserRole[user.rol] ?? user.rol });
    setDialogOpen(true);
  };

  const handleDeleteUser = (id: string, userRole?: string) => {
    // Verificar si el usuario está intentando eliminarse a sí mismo
    if (currentUser && currentUser.id === id) {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Acción no permitida",
          desc: "No puedes eliminar tu propia cuenta de usuario",
        }),
      );
      return;
    }

    // No permitir eliminar usuarios con rol Cliente (5)
    if (userRole === "5") {
      dispatch(
        setMessage({
          view: true,
          type: "Error",
          text: "Acción no permitida",
          desc: "Los usuarios tipo Cliente no se pueden eliminar desde aquí. Elimínalos desde la sección de Clientes.",
        }),
      );
      return;
    }

    dispatch(setIsLoading(true));
    const sendData = async () => {
      try {
        const res = await axiosApi.delete(`users/${id}`);

        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "Success!!",
            desc: res.data.message,
          }),
        );

        const refresh = await axiosApi.get("/Users");
        dispatch(setUsers(refresh.data.data));
      } catch (error: any) {
        dispatch(
          setMessage({
            view: true,
            type: "Error",
            text: error.response.statusText,
            desc: error.response.data.message,
          }),
        );
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    sendData();
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "2": // Veterinario
        return "default";
      case "1": // Administrador
        return "secondary";
      case "4": // Asistente
        return "outline";
      case "3": // Recepcionista
        return "outline";
      case "5": // Cliente
        return "destructive"; // Usar un color diferente para clientes
      default:
        return "outline";
    }
  };

  // Función para verificar si es el usuario actual
  const isCurrentUser = (userId: string) => {
    return currentUser && currentUser.id === userId;
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="p-4 md:ml-64 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Usuarios
            </h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Gestión de personal y permisos
            </p>
          </div>
          <Button onClick={handleAddUser} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Personal Registrado
            </CardTitle>
            <CardDescription className="text-sm">
              Lista completa de usuarios del sistema
            </CardDescription>

            {/* Barra de búsqueda y filtros */}
            <div className="space-y-3 mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {/* Filtro por Rol */}
                <Select value={rolFilter} onValueChange={setRolFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los roles</SelectItem>
                    <SelectItem value="2">Veterinario</SelectItem>
                    <SelectItem value="1">Administrador</SelectItem>
                    <SelectItem value="4">Asistente</SelectItem>
                    <SelectItem value="3">Recepcionista</SelectItem>
                    <SelectItem value="5">Cliente</SelectItem>
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
                Mostrando {filteredUsers.length} de {users.length} usuarios
              </p>
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
                    <TableHead className="text-right min-w-[80px]">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.nombre}
                          {isCurrentUser(user.id) && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              Tú
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.telefono}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.rol)}>
                            {ROLES[user.rol] || user.rol}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "Activo" ? "default" : "secondary"
                            }
                          >
                            {user.status}
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
                                onClick={() => handleEditUser(user)}
                                disabled={user.rol === "5"}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                {user.rol === "5"
                                  ? "Cliente - No editable"
                                  : "Editar"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteUser(user.id, user.rol)
                                }
                                className="text-destructive"
                                disabled={
                                  isCurrentUser(user.id) || user.rol === "5"
                                }
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {isCurrentUser(user.id)
                                  ? "No puedes eliminarte"
                                  : user.rol === "5"
                                    ? "Cliente - No editable"
                                    : "Eliminar"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <p className="text-muted-foreground">
                          No se encontraron usuarios con los filtros aplicados
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

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
      />
    </div>
  );
}
