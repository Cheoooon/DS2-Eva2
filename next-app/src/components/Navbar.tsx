import { auth } from "@/lib/auth"
import Link from "next/link"
import LogoutButton from "./LogoutButton"

export default async function Navbar() {
  const session = await auth()
  if (!session) return null

  const role = session.user?.role

  return (
    <nav className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center">
      <div className="flex gap-6 font-medium text-slate-600">
        <Link href="/" className="hover:text-slate-900 transition-colors">Dashboard</Link>
        <Link href="/reservations" className="hover:text-slate-900 transition-colors">Reservas</Link>
        {(role === "STAFF" || role === "ADMIN") && <Link href="/tables" className="hover:text-slate-900 transition-colors">Mesas</Link>}
        {role === "ADMIN" && <Link href="/admin" className="hover:text-slate-900 transition-colors">Usuarios</Link>}
        {role === "ADMIN" && <Link href="/admin/config" className="hover:text-slate-900 transition-colors">Config</Link>}
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-500">
        <span>{session.user?.email}</span>
        <LogoutButton />
      </div>
    </nav>
  )
}
