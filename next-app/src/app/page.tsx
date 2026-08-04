import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/login")

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Panel Principal</h1>
      <p>Bienvenido, {session.user?.name || session.user?.email}</p>
      <p>Rol: {session.user?.role}</p>
      {/* Aquí podrías renderizar widgets según el rol */}
    </div>
  )
}
