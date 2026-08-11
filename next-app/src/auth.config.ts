import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  providers: [
    // Los proveedores se definen aquí, pero la lógica de autorización
    // de Prisma debe ir en auth.ts para evitar problemas de compatibilidad Edge
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirigir a login
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
