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
import { Plus, Search, Pencil, Trash2, MoreVertical, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientDialog } from "@/components/client-dialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { axiosApi } from "../axiosApi/axiosApi";
import {
  setClients,
  setIsLoading,
  setMessage,
} from "@/Redux/reducers/interfaceReducer";

type Client = {
  id: string;
  cedula?: string; // Añadir cedula que es lo que se usa como ID real
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  registrationdate: string; // Cambiar a lowercase para coincidir con la API
  status: "Activo" | "Inactivo";
};

export default function ClientesPage() {
  const clients = useSelector((state: RootState) => state.interface.clients);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const dispatch = useDispatch();
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.phone.includes(searchQuery) ||
      client.city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    const getClients = async () => {
      const res = await axiosApi.get("/clients");
      dispatch(setClients(res.data.data));
    };
    getClients();
  }, []);

  const handleAddClient = () => {
    setSelectedClient(null);
    setDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setDialogOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    // Usar cedula como ID para la eliminación
    const clientId = client.cedula || client.id;

    dispatch(setIsLoading(true));
    const sendData = async () => {
      try {
        const res = await axiosApi.delete(`/clients/${clientId}`);

        dispatch(
          setMessage({
            view: true,
            type: "",
            text: "Success!!",
            desc: res.data.message,
          }),
        );

        const refresh = await axiosApi.get("/clients");
        dispatch(setClients(refresh.data.data));
      } catch (error: any) {
        dispatch(
          setMessage({
            view: true,
            type: "Error",
            text: error.response.statusText,
            desc: error.response.data.message,
          }),
        );
      }
    };
    sendData();

    dispatch(setIsLoading(false));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardSidebar />

      <main className="p-4 md:ml-64 md:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Clientes
            </h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Registro de propietarios de mascotas
            </p>
          </div>
          <Button onClick={handleAddClient} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Nuevo Cliente
          </Button>
        </div>

        <div className="mb-4 grid gap-4 ">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Clientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">
                Propietarios registrados
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Registro de Clientes
            </CardTitle>
            <CardDescription className="text-sm">
              Lista completa de propietarios
            </CardDescription>
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

                    <TableHead className="min-w-[120px]">
                      Fecha Registro
                    </TableHead>
                    <TableHead className="min-w-[80px]">Estado</TableHead>
                    <TableHead className="text-right min-w-[80px]">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-muted-foreground">
                            {client.email}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {client.phone}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">{client.city}</span>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {(() => {
                          const fecha = client.registrationdate;
                          if (!fecha) return "-";
                          const d = new Date(fecha);
                          return isNaN(d.getTime())
                            ? "-"
                            : d.toLocaleDateString("es-ES");
                        })()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            client.status === "Activo" ? "default" : "secondary"
                          }
                        >
                          {client.status}
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
                              onClick={() => handleEditClient(client)}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClient(client)}
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

      <ClientDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        client={selectedClient}
      />
    </div>
  );
}
