import { auth } from "@/lib/auth"
import Link from "next/link"
import LogoutButton from "./LogoutButton"

export default async function Navbar() {
  const session = await auth()
  if (!session) return null

  const role = session.user?.role

  return (
    <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <div className="flex gap-4">
        <Link href="/">Dashboard</Link>
        {role === "ADMIN" && <Link href="/admin">Usuarios</Link>}
        {(role === "STAFF" || role === "ADMIN") && <Link href="/tables">Mesas</Link>}
        <Link href="/reservations">Reservas</Link>
      </div>
      <div className="flex items-center gap-4">
        <span>{session.user?.email} ({role})</span>
        <LogoutButton />
      </div>
    </nav>
  )
}
