import { getSystemConfig, updateSystemConfig } from "@/lib/actions/config"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminConfigPage() {
  const session = await auth()
  if (!session || session.user?.role !== "ADMIN") redirect("/dashboard")

  const config = await getSystemConfig()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Configuración del Sistema</h1>
      <form action={async (formData) => {
        "use server"
        const cancellationWindow = parseInt(formData.get("cancellationWindow") as string)
        const notificationRetention = parseInt(formData.get("notificationRetention") as string)
        await updateSystemConfig({ cancellationWindow, notificationRetention })
      }} className="max-w-md p-4 border rounded shadow">
        <div className="mb-4">
          <label>Ventana de cancelación (horas):</label>
          <Input name="cancellationWindow" type="number" defaultValue={config.cancellationWindow} />
        </div>
        <div className="mb-4">
          <label>Retención de notificaciones (días):</label>
          <Input name="notificationRetention" type="number" defaultValue={config.notificationRetention} />
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    </div>
  )
}
