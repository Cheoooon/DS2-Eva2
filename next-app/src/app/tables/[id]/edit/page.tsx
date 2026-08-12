import { getTableById, updateTable } from "@/lib/actions/table"
import { tableSchema } from "@/lib/schemas"
import { z } from "zod"
import TableForm from "@/components/TableForm"
import { redirect } from "next/navigation"
import { notFound } from "next/navigation"

export default async function EditTablePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const table = await getTableById(params.id)
  
  if (!table) notFound()

  async function onSubmit(data: z.infer<typeof tableSchema>) {
    "use server"
    await updateTable(params.id, data)
    redirect("/tables")
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Mesa: {table.name}</h1>
      <TableForm initialData={{ name: table.name, capacity: table.capacity, active: table.active }} onSubmit={onSubmit} />
    </div>
  )
}
