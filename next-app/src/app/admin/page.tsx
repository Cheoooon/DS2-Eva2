import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUsers, deleteUser } from "@/lib/actions/user"
import { Trash2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/Button"

export default async function AdminUsersPage(props: { searchParams: Promise<{ name?: string, email?: string, role?: string }> }) {
  const session = await auth()
  const searchParams = await props.searchParams
  
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const allUsers = await getUsers()
  
  // Filtros en memoria (ponytail: si la lista crece, mover a query de BD)
  const users = allUsers.filter(u => 
    (!searchParams.name || u.name?.toLowerCase().includes(searchParams.name.toLowerCase())) &&
    (!searchParams.email || u.email.toLowerCase().includes(searchParams.email.toLowerCase())) &&
    (!searchParams.role || u.role === searchParams.role)
  )

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administrar Usuarios</h1>
        <Link href="/admin/new">
            <Button>Nuevo Usuario</Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
        <input placeholder="Nombre" defaultValue={searchParams.name} className="border p-2 rounded" />
        <input placeholder="Email" defaultValue={searchParams.email} className="border p-2 rounded" />
        <select defaultValue={searchParams.role} className="border p-2 rounded">
            <option value="">Todos los roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="STAFF">STAFF</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-slate-300">
        <thead>
          <tr className="bg-slate-100">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2 flex gap-2">
                <Link href={`/admin/${user.id}/edit`}>
                    <Button variant="outline">Editar</Button>
                </Link>
                <form action={async () => {
                  "use server"
                  await deleteUser(user.id)
                }}>
                  <button type="submit" className="p-2 text-slate-500 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
