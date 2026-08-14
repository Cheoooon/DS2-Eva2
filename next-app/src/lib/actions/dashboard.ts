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
          status: { notIn: [Status.CANCELLED, Status.MOVED] }
        }
      }
    },
    orderBy: { name: 'asc' }
  })

  // Ordenar mesas: activas primero, luego inactivas
  tables.sort((a, b) => {
    if (a.active === b.active) return a.name.localeCompare(b.name);
    return a.active ? -1 : 1;
  });

  return tables.map(t => ({
      ...t,
      reservations: t.reservations.map(r => ({
          ...r,
          startTime: new Date(`${r.date}T${r.startHour.toString().padStart(2, '0')}:00:00Z`),
          endTime: new Date(`${r.date}T${r.endHour.toString().padStart(2, '0')}:00:00Z`)
      }))
  }))
}
