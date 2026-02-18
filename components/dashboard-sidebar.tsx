"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserPlus,
  PawPrint,
  LayoutDashboard,
  Calendar,
  Stethoscope,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";

// Roles: 1=Administrador, 2=Veterinario, 3=Recepcionista, 4=Asistente, 5=Cliente
const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["1", "2", "3", "4"], // Admin, Veterinario, Recepcionista, Asistente
  },
  {
    name: "Usuarios",
    href: "/usuarios",
    icon: Users,
    roles: ["1"], // Solo Admin
  },
  {
    name: "Clientes",
    href: "/clientes",
    icon: UserPlus,
    roles: ["1", "2", "3", "4"], // Admin, Veterinario, Recepcionista, Asistente
  },
  {
    name: "Pacientes",
    href: "/pacientes",
    icon: PawPrint,
    roles: ["1", "2", "3", "4"], // Admin, Veterinario, Recepcionista, Asistente
  },
  {
    name: "Citas",
    href: "/citas",
    icon: Calendar,
    roles: ["1", "2", "3", "4"], // Admin, Veterinario, Recepcionista, Asistente
  },
  {
    name: "Atender Pacientes",
    href: "/atender-pacientes",
    icon: Stethoscope,
    roles: ["2"], // Solo Veterinario
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const userRole = useSelector((state: RootState) => state.interface.auth?.rol);

  // Filtrar navegación según el rol del usuario
  const filteredNavigation = navigation.filter((item) => {
    if (!item.roles || !userRole) return true; // Si no hay rol definido, mostrar todo
    return item.roles.includes(String(userRole));
  });

  return (
    <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar md:block">
      <nav className="flex flex-col gap-1 p-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
