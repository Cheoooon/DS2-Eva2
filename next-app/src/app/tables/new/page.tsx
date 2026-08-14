import TableForm from "@/components/TableForm"
import { createTableAction } from "@/lib/actions/table"

export default function NewTablePage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Nueva Mesa</h1>
            <TableForm action={createTableAction} />
        </div>
    )
}
