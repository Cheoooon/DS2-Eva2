"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"

interface Reservation {
  id: string
  startHour: number
  endHour: number
  customerName: string
  occupants: number
  status: string
  notes?: string | null
}

interface TableData {
  id: string
  name: string
  capacity: number
  active: boolean
  reservations: Reservation[]
}

export default function TimelineView({ data }: { data: TableData[] }) {
  const [currentHour, setCurrentHour] = useState<number | null>(null)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [hourColWidth, setHourColWidth] = useState(60)
  const gridRef = useRef<HTMLDivElement>(null)

  const hours = Array.from({ length: 15 }, (_, i) => i + 8) // 8:00 a 22:00

  // Reservas activas globalmente en la hora seleccionada por el slider
  const activeReservationsAtHour =
    currentHour !== null
      ? data.flatMap((table) =>
          table.reservations
            .filter((r) => currentHour >= r.startHour && currentHour < r.endHour)
            .map((r) => ({ ...r, tableName: table.name, tableId: table.id }))
        )
      : []

  const selectedTable = data.find((t) => t.id === selectedTableId)
  const selectedReservation =
    selectedTable && selectedHour !== null
      ? selectedTable.reservations.find(
          (r) => selectedHour >= r.startHour && selectedHour < r.endHour
        )
      : null

  useEffect(() => {
    const updateWidth = () => {
      if (gridRef.current) {
        const totalWidth = gridRef.current.clientWidth
        // 100px para la columna 'Mesa', el resto dividido entre las 15 horas
        setHourColWidth(Math.max(50, (totalWidth - 100) / 15))
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const handleTableClick = (tableId: string) => {
    setSelectedTableId(tableId)
    setSelectedHour(null)
    setCurrentHour(null)
  }

  const handleSlotClick = (tableId: string, hour: number) => {
    setSelectedTableId(tableId)
    setSelectedHour(hour)
    setCurrentHour(null)
  }

  return (
    <div className="space-y-6">
      {/* Contenedor Grid Timeline */}
      <div className="overflow-x-auto p-4 bg-white rounded-lg shadow" ref={gridRef}>
        <div
          className="grid bg-slate-200 gap-px border-t border-l border-r border-b border-slate-200 table-fixed"
          style={{
            gridTemplateColumns: `100px repeat(${hours.length}, 1fr)`,
          }}
        >
          {/* Header Slider Label */}
          <div className="text-[10px] font-bold bg-slate-50 flex items-center justify-center p-1 text-center border-b border-slate-300 w-full h-[40px]">
            <span className="leading-[1] px-1">
              {currentHour !== null ? <>{currentHour}:00<br />{currentHour + 1}:00</> : <>Selecciona<br />horario</>}
            </span>
          </div>

          {/* Slider alineado con las columnas de horas */}
          <div
            className="col-span-15 p-2 bg-slate-100 flex items-center"
            style={{
              paddingLeft: `${hourColWidth / 2 - 8}px`,
              paddingRight: `${hourColWidth / 2 - 8}px`,
            }}
          >
            <input
              type="range"
              min="8"
              max="22"
              value={currentHour ?? 8}
              onClick={() => {
                if (currentHour === null) setCurrentHour(8)
              }}
              onInput={(e) => {
                setCurrentHour(parseInt((e.target as HTMLInputElement).value))
                setSelectedTableId(null)
                setSelectedHour(null)
              }}
              className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                currentHour === null ? "bg-slate-200 slider-no-value" : "bg-blue-500"
              }`}
            />
          </div>

          {/* Table Header */}
          <div className="bg-slate-50 font-bold p-2 text-center truncate border-b border-slate-300">Mesa</div>

          {/* Hours Headers */}
          {hours.map((h) => (
            <div key={h} className="flex flex-col items-center justify-center border-r border-l border-white border-b border-slate-300 py-1">
              <span className={`text-[10px] font-medium px-2 py-0 rounded-full ${currentHour === h ? "bg-blue-200 text-blue-800 font-bold" : "bg-slate-200 text-slate-700"}`}>
                {h}:00
              </span>
              <div className="w-4 h-px bg-slate-400 my-0"></div>
              <span className={`text-[10px] font-medium px-2 py-0 rounded-full ${currentHour === h ? "bg-blue-200 text-blue-800 font-bold" : "bg-slate-200 text-slate-700"}`}>
                {h + 1}:00
              </span>
            </div>
          ))}

          {/* Filas por Mesa */}
          {data.map((table, tableIndex) => {
            const rowIndex = tableIndex + 3

            return (
              <div key={table.id} className="contents">
                {/* Nombre de la mesa */}
                <div
                  className={`font-medium p-2 bg-white flex items-center cursor-pointer truncate ${
                    selectedTableId === table.id && selectedHour === null ? "bg-blue-50" : ""
                  }`}
                  style={{ gridRow: rowIndex }}
                  onClick={() => handleTableClick(table.id)}
                >
                  <span className="truncate">#{table.name}</span>
                </div>

                {/* Renderizado único: Celdas vacías o Bloques de Reserva */}
                {hours.map((h, i) => {
                  const resAtStart = table.reservations.find((r) => r.startHour === h)
                  const isCoveredByRes = table.reservations.some(
                    (r) => h >= r.startHour && h < r.endHour
                  )

                  if (resAtStart) {
                    const duration = Math.max(1, resAtStart.endHour - resAtStart.startHour)
                    const colStart = h - 8 + 2
                    const isSelected =
                      selectedTableId === table.id &&
                      selectedHour !== null && selectedHour >= resAtStart.startHour &&
                      selectedHour < resAtStart.endHour

                    return (
                      <div
                        key={resAtStart.id}
                        className={`flex items-center justify-center p-0.5 cursor-pointer min-w-0 overflow-hidden ${
                          isSelected ? "z-20" : "z-10"
                        }`}
                        style={{
                          gridRow: rowIndex,
                          gridColumn: `${colStart} / span ${duration}`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedTableId(table.id)
                          setSelectedHour(resAtStart.startHour)
                          setCurrentHour(null)
                        }}
                      >
                        <div
                          className={`w-full h-full text-xs rounded flex items-center justify-center text-red-900 font-semibold min-w-0 overflow-hidden transition-all ${
                            isSelected
                              ? "bg-red-400 ring-2 ring-blue-500 ring-inset shadow-md"
                              : "bg-red-200 hover:bg-red-300"
                          }`}
                        >
                          <span className="truncate px-1 block w-full text-center">
                            {resAtStart.customerName}
                          </span>
                        </div>
                      </div>
                    )
                  }

                  if (isCoveredByRes) {
                    return null
                  }

                  const isSlotSelected = selectedTableId === table.id && selectedHour === h

                  return (
                    <div
                      key={`${table.id}-${h}`}
                      className={`bg-white cursor-pointer hover:bg-slate-50 transition-colors ${
                        isSlotSelected ? "z-20 ring-2 ring-inset ring-blue-500" : ""
                      }`}
                      style={{ gridRow: rowIndex, gridColumn: i + 2 }}
                      onClick={() => handleSlotClick(table.id, h)}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* Panel Inferior: Detalle de Mesa o Vista Global por Hora */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        {/* Caso 1: Se usó el slider y hay un horario global activo */}
        {currentHour !== null ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-lg">
                Reservas activas a las {currentHour}:00 - {currentHour + 1}:00
              </h3>
              <span className="text-sm bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full">
                {activeReservationsAtHour.length} {activeReservationsAtHour.length === 1 ? "reserva" : "reservas"}
              </span>
            </div>

            {activeReservationsAtHour.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeReservationsAtHour.map((res) => (
                  <div
                    key={res.id}
                    className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-1 cursor-pointer hover:border-blue-400"
                    onClick={() => {
                      setSelectedTableId(res.tableId)
                      setSelectedHour(res.startHour)
                      setCurrentHour(null)
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-slate-900">{res.customerName}</span>
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        Mesa #{res.tableName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{res.occupants} personas</p>
                    <p className="text-xs text-slate-500">
                      Horario: {res.startHour}:00 - {res.endHour}:00
                    </p>
                    {res.notes && (
                      <p className="text-xs italic text-slate-500 mt-1 truncate">
                        Nota: {res.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">
                No hay reservas activas en ninguna mesa a las {currentHour}:00.
              </p>
            )}
          </div>
        ) : selectedTable ? (
          /* Caso 2: Se seleccionó una mesa o casilla específica */
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Detalle: Mesa #{selectedTable.name}</h3>
              <Link href="/tables" className="text-sm text-blue-600 hover:underline">
                Editar Mesa
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm bg-white p-3 rounded border">
              <p>
                <span className="font-semibold">Capacidad:</span> {selectedTable.capacity}
              </p>
              <p>
                <span className="font-semibold">Estado:</span>{" "}
                {selectedTable.active ? "Activa" : "Inactiva"}
              </p>
              <p>
                <span className="font-semibold">Reservas Hoy:</span>{" "}
                {selectedTable.reservations.length}
              </p>
              <p>
                <span className="font-semibold">Ocupantes Totales:</span>{" "}
                {selectedTable.reservations.reduce((sum, r) => sum + r.occupants, 0)}
              </p>
            </div>

            {selectedReservation ? (
              <div className="bg-white p-3 rounded shadow-sm border mt-2">
                <p className="font-semibold text-lg">{selectedReservation.customerName}</p>
                <p className="text-sm text-slate-600">
                  {selectedReservation.occupants} personas
                </p>
                <p className="text-xs text-slate-500">
                  Estado: {selectedReservation.status}
                </p>
                <p className="text-sm mt-2 font-medium">
                  Horario: {selectedReservation.startHour}:00 - {selectedReservation.endHour}:00
                </p>
                {selectedReservation.notes && (
                  <p className="text-sm italic text-slate-600 mt-1 bg-slate-100 p-2 rounded">
                    Notas: {selectedReservation.notes}
                  </p>
                )}
              </div>
            ) : (
              <Link
                href={`/reservations?date=${new Date().toISOString().split("T")[0]}&time=${
                  selectedHour ? `${selectedHour}:00` : "08:00"
                }&table=${selectedTableId}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2 text-sm font-medium"
              >
                Crear Reserva en este horario ({selectedHour ? `${selectedHour}:00 - ${selectedHour + 1}:00` : "Selecciona hora"})
              </Link>
            )}
          </div>
        ) : (
          /* Caso 3: Estado inicial sin selección */
          <p className="text-slate-500 text-sm">
            Selecciona una mesa, una hora en la grilla o desliza el control superior para ver detalles.
          </p>
        )}
      </div>
    </div>
  )
}