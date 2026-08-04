"use server"

import { signIn } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", formData)
  } catch (error) {
    if (error instanceof AuthError) {
      // Capturamos específicamente errores de autenticación
      return "Credenciales inválidas o usuario no encontrado."
    }
    // NextAuth throws a redirect error to trigger the redirect
    throw error 
  }
}
