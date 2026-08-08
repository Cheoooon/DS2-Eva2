"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { loginSchema } from "@/lib/schemas"
import { signIn } from "next-auth/react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { useState } from "react"

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setError(null)
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    })
    
    if (result?.error) {
      setError("Credenciales inválidas o usuario no encontrado.")
    } else {
      window.location.href = "/"
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 border rounded shadow-md w-full max-w-sm">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      <div className="mb-4">
        <Input {...register("email")} placeholder="Email" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="mb-4">
        <Input {...register("password")} type="password" placeholder="Password" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Cargando..." : "Login"}
      </Button>
    </form>
  )
}
