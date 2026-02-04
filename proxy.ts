import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rutas que requieren autenticación
const protectedRoutes = [
  "/dashboard",
  "/usuarios",
  "/clientes",
  "/pacientes",
  "/citas",
  "/atender-pacientes",
  "/configuracion",
  "/perfil",
];

// Rutas públicas (login, register, etc)
const publicRoutes = ["/", "/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener el token de la cookie
  const token = request.cookies.get("auth-token")?.value;

  // Verificar si la ruta actual está protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route),
  );

  // Si es una ruta protegida
  if (isProtectedRoute) {
    // No hay token, redirigir a login
    if (!token) {
      const url = new URL("/", request.url);
      // Guardar la URL original para redirigir después del login
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Token válido, continuar
    return NextResponse.next();
  }

  // Si es una ruta pública y hay token, redirigir al dashboard
  if (isPublicRoute && token) {
    // Usuario ya autenticado intentando acceder a login/register
    // Redirigir al dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Para todas las demás rutas, continuar normalmente
  return NextResponse.next();
}

// Configurar qué rutas deben pasar por el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
