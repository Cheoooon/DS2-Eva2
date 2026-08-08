"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"

export default function TimelineView({ data }: { data: any[] }) {
  const [currentHour, setCurrentHour] = useState<number | null>(null)
  const [selectedCell, setSelectedCell] = useState<{ tableId: string, hour: number } | null>(null)
  const [hourColWidth, setHourColWidth] = useState(60) 
  const gridRef = useRef<HTMLDivElement>(null)
  
  const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 8:00 a 22:00

  // Cálculo para panel de detalle global
  const activeReservationsAtHour = currentHour !== null 
    ? data.flatMap(table => 
        table.reservations
            .filter((r: any) => {
                const startHour = new Date(r.startTime).getHours();
                const endHour = new Date(r.endTime).getHours();
                return currentHour >= startHour && currentHour < endHour;
            })
            .map(r => ({ ...r, tableName: `Mesa #${table.id.slice(-4)}`, tableId: table.id }))
      )
    : [];

  // Datos para el panel de detalle de celda seleccionada
  const selectedReservation = selectedCell
    ? data.find(t => t.id === selectedCell.tableId)?.reservations.find((r: any) => {
        const startHour = new Date(r.startTime).getHours();
        const endHour = new Date(r.endTime).getHours();
        return selectedCell.hour >= startHour && selectedCell.hour < endHour;
      })
    : null;

  // Medir ancho para alineación del slider
  useEffect(() => {
    const updateWidth = () => {
      if (gridRef.current) {
        const totalWidth = gridRef.current.clientWidth;
        setHourColWidth((totalWidth - 100) / 15);
      }
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const handleCellClick = (tableId: string, hour: number) => {
    setSelectedCell({ tableId, hour });
    setCurrentHour(null);
  };

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto p-4 bg-white rounded-lg shadow" ref={gridRef}>
        
        {/* Grid Principal */}
        <div 
            className="grid bg-slate-200 gap-px border-t border-l border-slate-200" 
            style={{ gridTemplateColumns: `100px repeat(${hours.length}, 1fr)` }}
        >
            {/* Scrubber (fila 1) */}
            <div className="text-xs font-bold bg-slate-50 flex items-center justify-center">
                {currentHour !== null ? `Hora: ${currentHour}:00` : "Desliza para hora"}
            </div>
            <div className="col-span-15 p-2 bg-slate-100 flex items-center" 
                 style={{ paddingLeft: `${hourColWidth / 2 - 8}px`, paddingRight: `${hourColWidth / 2 - 8}px` }}>
                <input 
                    type="range" min="8" max="22" value={currentHour ?? 8}
                    onClick={() => {
                        if (currentHour === null) {
                            setCurrentHour(8);
                            setSelectedCell(null);
                        }
                    }}
                    onInput={(e) => { 
                        const val = parseInt((e.target as HTMLInputElement).value);
                        setCurrentHour(val); 
                        setSelectedCell(null); 
                    }}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${currentHour === null ? 'bg-slate-200 slider-no-value' : 'bg-blue-500'}`}
                />
            </div>

            {/* Encabezados (fila 2) */}
            <div className="bg-slate-50 font-bold p-2 text-center">Mesa</div>
            {hours.map(h => (
                <div key={h} className={`text-center text-sm font-semibold p-2 bg-slate-50 ${currentHour === h ? 'bg-blue-100 text-blue-700' : ''}`}>
                    {h}:00
                </div>
            ))}

            {/* Contenido por Mesa */}
            {data.map((table, tableIndex) => {
                const rowIndex = tableIndex + 3;
                return (
                    <div key={table.id} className="contents">
                        {/* Nombre Mesa */}
                        <div className={`font-medium p-2 bg-white flex items-center cursor-pointer ${selectedCell?.tableId === table.id && currentHour === null ? 'bg-blue-50' : ''}`}
                             style={{ gridRow: rowIndex }}
                             onClick={() => handleCellClick(table.id, currentHour ?? 8)}>
                            #{table.id.slice(-4)}
                        </div>

                        {/* Celdas de fondo */}
                        {hours.map((h, i) => (
                            <div 
                                key={`${table.id}-${h}`}
                                className={`bg-white cursor-pointer hover:bg-slate-50 ${selectedCell?.tableId === table.id && selectedCell?.hour === h && !table.reservations.some((r: any) => h >= new Date(r.startTime).getHours() && h < new Date(r.endTime).getHours()) ? 'relative z-20 ring-2 ring-inset ring-blue-500' : ''}`}
                                style={{ gridRow: rowIndex, gridColumn: i + 2 }}
                                onClick={() => handleCellClick(table.id, h)} 
                            />
                        ))}
                        
                        {/* Reservas */}
                        {table.reservations.map((res: any) => {
                            const start = new Date(res.startTime).getHours();
                            const end = new Date(res.endTime).getHours();
                            const duration = Math.max(1, end - start);
                            const colStart = (start - 8) + 2;

                            const isSelected = selectedCell?.tableId === table.id && selectedCell?.hour >= start && selectedCell?.hour < end;

                            return (
                                <div
                                    key={res.id}
                                    className="z-10 flex items-center justify-center p-px"
                                    style={{ 
                                        gridRow: rowIndex, 
                                        gridColumn: `${colStart} / span ${duration}` 
                                    }}
                                    onClick={() => handleCellClick(table.id, start)}
                                >
                                    <div className={`w-full h-full text-xs rounded flex items-center justify-center bg-red-200 hover:bg-red-300 text-red-900 font-semibold truncate cursor-pointer
                                        ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}
                                    `}>
                                        <span className="truncate">{res.customerName}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
      </div>
      
      {/* Info Panel */}
      <div className="p-4 bg-slate-50 rounded-lg border">
          {selectedCell ? (
              <div className="space-y-2">
                  <h3 className="font-bold">Detalle: Mesa #{selectedCell.tableId.slice(-4)}</h3>
                  {selectedReservation ? (
                      <div className="bg-white p-3 rounded shadow-sm border">
                          <p className="font-semibold text-lg">{selectedReservation.customerName}</p>
                          <p className="text-sm text-slate-600">{selectedReservation.occupants} personas</p>
                          <p className="text-xs text-slate-500">Estado: {selectedReservation.status}</p>
                          <p className="text-sm mt-2 font-medium">Horario: {new Date(selectedReservation.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(selectedReservation.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          {selectedReservation.notes && <p className="text-sm italic text-slate-600 mt-1 bg-slate-100 p-2 rounded">Notas: {selectedReservation.notes}</p>}
                      </div>
                  ) : (
                      <Link 
                        href={`/reservations?date=${new Date().toISOString().split('T')[0]}&time=${selectedCell.hour.toString().padStart(2, '0')}:00`}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Crear Reserva aquí
                      </Link>
                  )}
              </div>
          ) : currentHour !== null ? (
              <div>
                <h3 className="font-bold mb-2">Detalle de reservas - {currentHour}:00</h3>
                {activeReservationsAtHour.length === 0 ? (
                    <p className="text-sm text-slate-500">No hay mesas ocupadas a esta hora.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {activeReservationsAtHour.map((res: any) => (
                            <div 
                                key={res.id} 
                                className="bg-white p-3 rounded shadow-sm text-sm border cursor-pointer hover:border-blue-300"
                                onClick={() => handleCellClick(res.tableId, currentHour)}
                            >
                                <p className="font-semibold text-blue-900">{res.customerName}</p>
                                <p className="text-xs text-slate-500">{res.tableName} · {res.occupants} pax</p>
                                {res.notes && <p className="text-xs italic text-slate-400 mt-1">Notas: {res.notes}</p>}
                            </div>
                        ))}
                    </div>
                )}
              </div>
          ) : (
              <p className="text-slate-500">Selecciona una hora en el buscador o una celda para ver detalles.</p>
          )}
      </div>
    </div>
  )
}
