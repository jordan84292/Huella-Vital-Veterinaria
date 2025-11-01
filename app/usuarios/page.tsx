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
import { UserDialog } from "@/components/user-dialog";
import { axiosApi } from "../axiosApi/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import {
  setIsLoading,
  setMessage,
  setUsers,
} from "@/Redux/reducers/interfaceReducer";

type User = {
  id: string;
  nombre: string;
  email: string;
  rolName: string;
  status: "Activo" | "Inactivo";
  telefono: string;
};

export default function UsuariosPage() {
  const users = useSelector((state: RootState) => state.interface.users);
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

    // Filtro por rol
    const matchesRol = rolFilter === "todos" || user.rolName === rolFilter;

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

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDeleteUser = (id: string) => {
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
          })
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
          })
        );
      }
    };
    sendData();

    dispatch(setIsLoading(false));
  };

  const getRoleBadgeVariant = (role: User["rolName"]) => {
    switch (role) {
      case "Veterinario":
        return "default";
      case "Administrador":
        return "secondary";
      case "Asistente":
        return "outline";
      case "Recepcionista":
        return "outline";
      default:
        return "outline";
    }
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
                    <SelectItem value="Veterinario">Veterinario</SelectItem>
                    <SelectItem value="Administrador">Administrador</SelectItem>
                    <SelectItem value="Asistente">Asistente</SelectItem>
                    <SelectItem value="Recepcionista">Recepcionista</SelectItem>
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
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.telefono}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.rolName)}>
                            {user.rolName}
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
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user.id)}
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
