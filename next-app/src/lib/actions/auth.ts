"use server"

import { signIn } from "@/lib/auth"

export async function loginAction(prevState: string | undefined, formData: FormData) {
  await signIn("credentials", formData)
}
