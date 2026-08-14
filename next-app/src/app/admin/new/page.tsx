import UserForm from "@/components/UserForm"
import { createUser } from "@/lib/actions/user"

export default function NewUserPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Nuevo Usuario</h1>
            <UserForm action={createUser} />
        </div>
    )
}
