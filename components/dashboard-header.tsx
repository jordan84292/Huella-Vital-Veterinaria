"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNav } from "@/components/mobile-nav";
import Image from "next/image";
import logo from "@/public/logo.png";
import { deleteAuthCookie, getAuthCookie } from "@/lib/auth/cookies";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import { useEffect } from "react";
import { axiosApi } from "@/app/axiosApi/axiosApi";
import { setAuth, setMessage } from "@/Redux/reducers/interfaceReducer";

export function DashboardHeader() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.interface.auth);
  const dispatch = useDispatch();
  // Cargando los datos del usuario
  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await getAuthCookie();
        // CORRECCIÓN: Usar espacio en lugar de guion después de Bearer
        const response = await axiosApi.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`, // Cambiado de Bearer- a Bearer (con espacio)
          },
        });

        dispatch(setAuth(response.data.data));
      } catch (error: any) {
        console.error(
          "Error al cargar perfil:",
          error.response?.data || error.message,
        );
        deleteAuthCookie();
        // Opcional: Mostrar mensaje de error al usuario
        dispatch(
          setMessage({
            view: true,
            type: "Error",
            text: "Error al cargar perfil",
            desc: error.response?.data?.message || error.message,
          }),
        );
      }
    };

    loadData();
  }, [dispatch]);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-3">
          <MobileNav />
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary bg-transparent">
            <Image src={logo} alt="Logo" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground md:text-lg">
              Huella Vital
            </h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Sistema de Gestión
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 gap-2 rounded-lg px-2 md:px-3"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="Usuario"
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground ">
                    {(user.nombre || "U")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start text-left md:flex">
                  <span className="text-sm font-medium">{user.nombre}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.rolName}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/perfil">
                  <User className="mr-2 h-4 w-4" />
                  <span>Ver Información</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/configuracion">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurar Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  deleteAuthCookie();
                  router.push("/");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
