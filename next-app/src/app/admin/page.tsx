import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getUsers, updateUserRole, deleteUser } from "@/lib/actions/user"
import { Role } from "@prisma/client"
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
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
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
              <td className="border p-2">
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
