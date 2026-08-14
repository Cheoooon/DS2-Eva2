import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import UserFilterBar from "@/components/UserFilterBar"
import UserTable from "@/components/UserTable"
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

      <UserFilterBar />

      <UserTable users={users} />
    </div>
  )
}
