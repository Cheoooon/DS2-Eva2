import { createTable } from "@/lib/actions/table"
import TableForm from "@/components/TableForm"
import { redirect } from "next/navigation"

export default function NewTablePage() {
  async function onSubmit(data: { name: string; capacity: number }) {
    "use server"
    await createTable(data)
    redirect("/tables")
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nueva Mesa</h1>
      <TableForm onSubmit={onSubmit} />
    </div>
  )
}
