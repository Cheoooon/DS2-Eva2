import TableForm from "@/components/TableForm"
import { getTableById, updateTableAction } from "@/lib/actions/table"
import { notFound } from "next/navigation"

export default async function EditTablePage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const table = await getTableById(params.id)
    if (!table) notFound()

    async function handleUpdate(formData: FormData) {
        "use server"
        await updateTableAction(params.id, formData)
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Editar Mesa</h1>
            <TableForm initialData={table} action={handleUpdate} />
        </div>
    )
}
