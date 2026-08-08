import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUsers, updateUserRole, deleteUser, createUser } from "@/lib/actions/user"
import { Role } from "@/lib/prisma"
import { Button } from "@/components/ui/Button"

export default async function AdminUsersPage() {
  const session = await auth()
  
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const users = await getUsers()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Administrar Usuarios</h1>

      <div className="mb-8 p-4 border border-slate-300 rounded-lg bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Crear Nuevo Usuario</h2>
        <form action={createUser} className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nombre</label>
            <input name="name" type="text" required className="border border-slate-300 rounded p-2" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <input name="email" type="email" required className="border border-slate-300 rounded p-2" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Contraseña</label>
            <input name="password" type="password" required minLength={6} className="border border-slate-300 rounded p-2" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Rol</label>
            <select name="role" className="border border-slate-300 rounded p-2 h-[42px]">
              <option value="CLIENT">CLIENT</option>
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <Button type="submit" className="h-[42px]">Crear Usuario</Button>
        </form>
      </div>

      <table className="w-full border-collapse border border-slate-300">
        <thead>
          <tr>
            <th className="border p-2 border-slate-300">Email</th>
            <th className="border p-2 border-slate-300">Rol</th>
            <th className="border p-2 border-slate-300">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border p-2 border-slate-300">{user.email}</td>
              <td className="border p-2 border-slate-300">
                <form action={async (formData) => {
                  "use server"
                  const role = formData.get("role") as Role
                  await updateUserRole(user.id, role)
                }}>
                  <select name="role" defaultValue={user.role} className="border p-1">
                    <option value="CLIENT">CLIENT</option>
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <Button type="submit" className="ml-2 py-1">Actualizar</Button>
                </form>
              </td>
              <td className="border p-2 border-slate-300">
                <form action={async () => {
                  "use server"
                  await deleteUser(user.id)
                }}>
                  <Button type="submit" className="bg-red-500 hover:bg-red-600">Eliminar</Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
