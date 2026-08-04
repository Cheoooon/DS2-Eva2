import { getTables } from "@/lib/actions/table"

export default async function TablesPage() {
  const tables = await getTables()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Mesas</h1>
      <div className="grid gap-4">
        {tables.map((table) => (
          <div key={table.id} className="p-4 border rounded shadow">
            <p>ID: {table.id}</p>
            <p>Capacidad: {table.capacity}</p>
            <p>Estado: {table.active ? "Activa" : "Inactiva"}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
