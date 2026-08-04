"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      return "Credenciales inválidas."
    }
    // Si es un error de redirección de NextAuth, lo dejamos pasar
    if ((error as any)?.digest?.includes('NEXT_REDIRECT')) {
        throw error
    }
    console.error("Login error:", error)
    return "Error inesperado."
  }
}
