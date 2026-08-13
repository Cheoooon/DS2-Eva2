"use client"

import { useEffect, useState } from "react"

interface CurrentTimeIndicatorProps {
  totalTables: number
  startHour?: number // Por defecto 8
  endHour?: number   // Por defecto 23 (22:00 + 1 hora)
  testHour?: number  // Pasa un valor para pruebas (ej: 8.5)
}

export function CurrentTimeIndicator({
  totalTables,
  startHour = 8,
  endHour = 23,
  testHour,
}: CurrentTimeIndicatorProps) {
  const [mounted, setMounted] = useState(false)
  const [currentFloatHour, setCurrentFloatHour] = useState<number>(startHour)

  useEffect(() => {
    setMounted(true)

    const updateTime = () => {
      if (testHour !== undefined) {
        setCurrentFloatHour(testHour)
        return
      }
      const now = new Date()
      const hourFloat = (now.getHours()) + now.getMinutes() / 60
      setCurrentFloatHour(hourFloat)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [testHour])

  if (!mounted) return null
  if (currentFloatHour < startHour || currentFloatHour >= endHour) return null

  const hourBase = Math.floor(currentFloatHour)
  
  const minutePercent = (currentFloatHour - hourBase) * 100

  const targetCol = hourBase - startHour + 2

  return (
    <div
      className="absolute z-30 pointer-events-none w-full h-full relative"
      style={{
        gridColumn: targetCol,
        gridRow: `3 / span ${totalTables}`,
      }}
    >
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-red-500/60 shadow-[0_0_4px_rgba(239,68,68,0.8)] -translate-x-1/2"
        style={{ left: `${minutePercent}%` }}
      >
        <div className="w-2.5 h-2.5 bg-red-500 rounded-full absolute -top-1 -left-[4px]" />
      </div>
    </div>
  )
}