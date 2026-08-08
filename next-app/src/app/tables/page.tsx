import { getTables } from "@/lib/actions/table"
import TableManager from "@/components/TableManager"

export default async function TablesPage() {
  const tables = await getTables()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gestión de Mesas</h1>
      <TableManager tables={tables} />
    </div>
  )
}
