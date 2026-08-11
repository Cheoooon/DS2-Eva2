"use server"

import { prisma, Status } from "@/lib/prisma"

export async function getDashboardData(date: Date) {
  const dateStr = date.toISOString().split('T')[0];

  const tables = await prisma.table.findMany({
    where: { deletedAt: null },
    include: {
      reservations: {
        where: {
          date: dateStr,
          status: { not: Status.CANCELLED }
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  return tables.map(t => ({
      ...t,
      reservations: t.reservations.map(r => ({
          ...r,
          startTime: new Date(`${r.date}T${r.startHour.toString().padStart(2, '0')}:00:00Z`),
          endTime: new Date(`${r.date}T${r.endHour.toString().padStart(2, '0')}:00:00Z`)
      }))
  }))
}
