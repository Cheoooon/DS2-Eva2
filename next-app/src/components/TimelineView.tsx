"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/constants"
import { ReservationActions } from "@/components/ReservationActions"
import { Status } from "../../prisma/generated/prisma/client"
import { CurrentTimeIndicator } from "@/components/CurrentTimeIndicator"

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

export default function TimelineView({ data, isAdmin, date, config }: { data: TableData[], isAdmin: boolean, date: Date, config: any }) {
  const [currentHour, setCurrentHour] = useState<number | null>(null)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)
  const [selectedHour, setSelectedHour] = useState<number | null>(null)
  const [hourColWidth, setHourColWidth] = useState(60)
  const gridRef = useRef<HTMLDivElement>(null)

  const hours = Array.from({ length: config.viewEndHour - config.viewStartHour }, (_, i) => i + config.viewStartHour)

  // Reservas activas globalmente en la hora seleccionada por el slider
  const activeReservationsAtHour =
    currentHour !== null
      ? data.flatMap((table) =>
          table.reservations
            .filter((r) => currentHour >= r.startHour && currentHour < r.endHour && r.status !== 'CANCELLED' && r.status !== 'MOVED')
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
        const colWidth = (totalWidth - 100) / hours.length
        setHourColWidth(Math.max(50, colWidth))
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
      <div className="p-4 bg-slate-200 rounded-lg shadow border border-slate-200" ref={gridRef}>

      <div
        className="overflow-x-auto relative grid gap-px bg-slate-200 rounded-lg shadow border border-slate-200"
        style={{
          gridTemplateColumns: `100px repeat(${hours.length}, 1fr)`,
        }}
      >
        <div className="text-[10px] font-bold bg-slate-50 flex items-center justify-center text-center w-full h-[40px]">
          <span className="leading-[1]">
            {currentHour !== null ? <>{currentHour}:00<br />{currentHour + 1}:00</> : <>Selecciona<br />horario</>}
          </span>
        </div>

        <div className="col-start-2 col-end-[-1] row-start-1 bg-white z-0" />
        <div className="col-start-2 col-end-[-1] row-start-1 self-center h-1.5 bg-slate-300 rounded-full pointer-events-none z-0 my-auto" />

        {currentHour !== null && (() => {
          const activeIndex = currentHour - config.viewStartHour;
          const activeCol = activeIndex + 2; // +2 por la columna inicial de 100px

          return (
            <>
              {activeIndex > 0 && (
                <div 
                  className="col-start-2 row-start-1 self-center h-1.5 bg-blue-500 rounded-l-full pointer-events-none z-0 my-auto -mr-px transition-colors duration-150 peer-active:bg-blue-600"
                  style={{ gridColumnEnd: activeCol }}
                />
              )}

              <div 
                className={`row-start-1 self-center h-1.5 bg-blue-500 pointer-events-none z-0 my-auto w-1/2 justify-self-start transition-colors duration-150 peer-active:bg-blue-600 ${
                  activeIndex === 0 ? "rounded-l-full" : ""
                }`}
                style={{ gridColumnStart: activeCol }}
              />
            </>
          );
        })()}
        
        {currentHour !== null && (
          <div 
            className="row-start-1 flex items-center justify-center pointer-events-none z-10"
            style={{
              gridColumnStart: (currentHour - config.viewStartHour) + 2 
            }}
          >
            <div className="w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md" />
          </div>
        )}
        <input
          type="range"
          min={config.viewStartHour}
          max={config.viewEndHour - 1}
          value={currentHour ?? config.viewStartHour}
          onClick={() => {
            if (currentHour === null) setCurrentHour(config.viewStartHour)
          }}
          onInput={(e) => {
            setCurrentHour(parseInt((e.target as HTMLInputElement).value))
            setSelectedTableId(null)
            setSelectedHour(null)
          }}
          className="col-start-2 col-end-[-1] row-start-1 w-full h-full opacity-0 cursor-pointer z-20"
        />

        

        <div className="bg-slate-50 font-bold p-2 text-center truncate border-slate-300">Mesa</div>

        {hours.map((h) => (
          <div key={h} data-hour={h} className="z-10 flex flex-col items-center justify-center border-r border-l border-white border-b border-slate-300 bg-slate-100">
            <span className={`text-[10px] font-medium px-2 py-0 rounded-full ${currentHour === h ? "bg-blue-200 text-blue-800 font-bold" : "bg-slate-200 text-slate-700"}`}>
              {h}:00
            </span>
            <div className="w-4 h-px bg-slate-400 my-0"></div>
            <span className={`text-[10px] font-medium px-2 py-0 rounded-full ${currentHour === h ? "bg-blue-200 text-blue-800 font-bold" : "bg-slate-200 text-slate-700"}`}>
              {h + 1}:00
            </span>
          </div>
        ))}


          {data.map((table, tableIndex) => {
            const rowIndex = tableIndex + 3

            return (
              <div key={table.id} className="contents">
                <div
                  className={`font-medium p-2 bg-white flex flex-col cursor-pointer truncate justify-between relative ${
                    selectedTableId === table.id && selectedHour === null ? "bg-blue-50" : ""
                  } ${!table.active ? "text-slate-400 line-through bg-slate-50" : ""}`}
                  style={{ gridRow: rowIndex }}
                  onClick={() => handleTableClick(table.id)}
                >
                  <span className="truncate">#{table.name}</span>
                  <div className="absolute bottom-1 right-1 flex items-center text-[10px] text-slate-500 font-normal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    {table.capacity}
                  </div>
                </div>

                {/* Celdas vacías */}
                {hours.map((h, i) => {
                  const isOccupied = table.reservations.some(r => 
                    r.status !== 'CANCELLED' && r.status !== 'MOVED' && h >= r.startHour && h < r.endHour
                  );
                  if (isOccupied) return null;

                  const isSlotSelected = selectedTableId === table.id && selectedHour === h
                  return (
                    <div
                      key={`${table.id}-${h}`}
                      className={`cursor-pointer transition-colors ${
                        !table.active ? "bg-slate-50 cursor-not-allowed" : "bg-white hover:bg-slate-50"
                      } ${
                        isSlotSelected ? "z-20 ring-2 ring-inset ring-blue-500" : ""
                      }`}
                      style={{ gridRow: rowIndex, gridColumn: i + 2 }}
                      onClick={() => {
                        if (!table.active) return
                        handleSlotClick(table.id, h)
                      }}
                    />
                  )
                })}

                {/* Reservas visibles */}
                {table.reservations
                  .filter(r => r.status !== 'CANCELLED' && r.status !== 'MOVED')
                  .map(res => {
                    const displayStart = Math.max(res.startHour, config.viewStartHour);
                    const displayEnd = Math.min(res.endHour, config.viewEndHour);
                    
                    if (displayStart >= displayEnd) return null;

                    const duration = displayEnd - displayStart;
                    const colStart = displayStart - config.viewStartHour + 2;

                    const isSelected =
                      selectedTableId === table.id &&
                      selectedHour !== null && selectedHour >= res.startHour &&
                      selectedHour < res.endHour

                    return (
                      <div
                        key={res.id}
                        className={`z-10 flex items-center justify-center p-0.5 cursor-pointer min-w-0 overflow-hidden ${!table.active ? "opacity-50" : ""}`}
                        style={{
                          gridRow: rowIndex,
                          gridColumn: `${colStart} / span ${duration}`,
                        }}
                        onClick={(e) => {
                          if (!table.active) return
                          e.stopPropagation()
                          setSelectedTableId(table.id)
                          setSelectedHour(res.startHour)
                          setCurrentHour(null)
                        }}
                      >
                        <div
                          className={`w-full h-full text-xs rounded flex items-center justify-center font-semibold min-w-0 overflow-hidden transition-all ${
                              isSelected
                              ? "ring-2 ring-blue-500 ring-inset shadow-md"
                              : ""
                          } ${STATUS_COLORS[res.status as Status]}`}
                        >
                          <span className="truncate px-1 block w-full text-center">
                            {res.customerName}
                          </span>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            )
          })}

          <CurrentTimeIndicator totalTables={data.length} startHour={config.viewStartHour} endHour={config.viewEndHour} />
        </div>
      </div>

      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Detalle: Mesa #{selectedTable.name}</h3>
              <Link href={`/tables/${selectedTable.id}/edit`} className="text-sm text-blue-600 hover:underline">
                Editar Mesa
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm bg-white p-3 rounded border">
              <p>
                <span className="font-semibold">Capacidad de la mesa:</span> {selectedTable.capacity}
              </p>
              <p>
                <span className="font-semibold">Estado de la mesa:</span>{" "}
                {selectedTable.active ? "Activa" : "Inactiva"}
              </p>
              <p>
                <span className="font-semibold">Catidad de reservas:</span>{" "}
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
                  Estado: {STATUS_LABELS[selectedReservation.status as keyof typeof STATUS_LABELS]}
                </p>
                <p className="text-sm mt-2 font-medium">
                  Horario: {selectedReservation.startHour}:00 - {selectedReservation.endHour}:00
                </p>
                {selectedReservation.notes && (
                  <p className="text-sm italic text-slate-600 mt-1 bg-slate-100 p-2 rounded">
                    Notas: {selectedReservation.notes}
                  </p>
                )}
                <div className="mt-3">
                    <ReservationActions reservation={selectedReservation} isAdmin={isAdmin} />
                </div>
              </div>
            ) : (
              selectedTable?.active ? (
                <Link
                  href={`/reservations?date=${date.toISOString().split("T")[0]}&time=${
                    selectedHour ? `${selectedHour}:00` : ""
                  }&table=${selectedTableId}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2 text-sm font-medium"
                >
                  Crear Reserva en este horario ({selectedHour ? `${selectedHour}:00 - ${selectedHour + 1}:00` : "Selecciona hora"})
                </Link>
              ) : (
                <p className="text-sm text-slate-500 mt-2 italic">Esta mesa no está activa y no permite reservas.</p>
              )
            )}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">
            Selecciona una mesa, una hora en la grilla o desliza el control superior para ver detalles.
          </p>
        )}
      </div>
    </div>
  )
}
