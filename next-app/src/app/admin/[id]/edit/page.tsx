import UserForm from "@/components/UserForm"
import { getUserById, updateUser } from "@/lib/actions/user"
import { Role } from "@/lib/prisma"
import { notFound } from "next/navigation"

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const user = await getUserById(params.id)
    if (!user) notFound()

    async function handleUpdate(formData: FormData) {
        "use server"
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const role = formData.get("role") as Role
        await updateUser(params.id, { name, email, role })
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Editar Usuario</h1>
            <UserForm initialData={user} action={handleUpdate} />
        </div>
    )
}
