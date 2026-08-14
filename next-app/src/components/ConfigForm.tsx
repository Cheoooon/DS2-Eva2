"use client"
import { useState } from "react"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { updateSystemConfig } from "@/lib/actions/config"

export default function ConfigForm({ config }: { config: any }) {
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (formData: FormData) => {
        setMessage(null)
        setError(null)
        try {
            const cancellationWindow = isNaN(parseInt(formData.get("cancellationWindow") as string)) ? 24 : parseInt(formData.get("cancellationWindow") as string)
            const notificationRetention = isNaN(parseInt(formData.get("notificationRetention") as string)) ? 30 : parseInt(formData.get("notificationRetention") as string)
            const viewStartHour = isNaN(parseInt(formData.get("viewStartHour") as string)) ? 8 : parseInt(formData.get("viewStartHour") as string)
            const viewEndHour = isNaN(parseInt(formData.get("viewEndHour") as string)) ? 23 : parseInt(formData.get("viewEndHour") as string)
            const formStartHour = isNaN(parseInt(formData.get("formStartHour") as string)) ? 8 : parseInt(formData.get("formStartHour") as string)
            const formEndHour = isNaN(parseInt(formData.get("formEndHour") as string)) ? 23 : parseInt(formData.get("formEndHour") as string)
            
            await updateSystemConfig({ cancellationWindow, notificationRetention, viewStartHour, viewEndHour, formStartHour, formEndHour })
            setMessage("Configuración guardada correctamente.")
        } catch (e: any) {
            setError("Error al guardar la configuración.")
        }
    }

    return (
        <form action={handleSubmit} className="max-w-md p-4 border rounded shadow bg-white">
            {message && <p className="text-green-600 text-sm bg-green-50 p-2 rounded mb-4">{message}</p>}
            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded mb-4">{error}</p>}
            
            <div className="mb-4">
                <label className="text-sm font-medium">Ventana de cancelación (horas):</label>
                <Input name="cancellationWindow" type="number" defaultValue={config.cancellationWindow} />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium">Retención de notificaciones (días):</label>
                <Input name="notificationRetention" type="number" defaultValue={config.notificationRetention} />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium">Hora inicio visualización:</label>
                <Input name="viewStartHour" type="number" defaultValue={config.viewStartHour} />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium">Hora fin visualización:</label>
                <Input name="viewEndHour" type="number" defaultValue={config.viewEndHour} />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium">Hora inicio formulario:</label>
                <Input name="formStartHour" type="number" defaultValue={config.formStartHour} />
            </div>
            <div className="mb-4">
                <label className="text-sm font-medium">Hora fin formulario:</label>
                <Input name="formEndHour" type="number" defaultValue={config.formEndHour} />
            </div>
            <Button type="submit">Guardar cambios</Button>
        </form>
    )
}
