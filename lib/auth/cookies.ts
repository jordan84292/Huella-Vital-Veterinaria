"use server";

import { cookies } from "next/headers";

/**
 * Establece la cookie de autenticación con el token JWT
 * @param token - Token JWT generado por el backend
 */
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();

  // Configuración de la cookie
  cookieStore.set("auth-token", token, {
    httpOnly: true, // No accesible desde JavaScript del cliente (seguridad)
    secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
    sameSite: "strict", // Protección contra CSRF
    maxAge: 60 * 60 * 24 * 7, // 7 días en segundos
    path: "/", // Disponible en todas las rutas
  });
}

/**
 * Obtiene el token de autenticación de la cookie
 * @returns Token JWT o null si no existe
 */
export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth-token");
  return authCookie?.value || null;
}

/**
 * Elimina la cookie de autenticación
 */
export async function deleteAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
}

/**
 * Verifica si existe una cookie de autenticación válida
 * @returns true si existe, false en caso contrario
 */
export async function hasAuthCookie(): Promise<boolean> {
  const token = await getAuthCookie();
  return token !== null;
}
