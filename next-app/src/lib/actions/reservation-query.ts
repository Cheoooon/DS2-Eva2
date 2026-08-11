"use server"

import { prisma, Status } from "@/lib/prisma"

export async function getReservationsForTable(tableId: string, date: Date) {
  const dateStr = date.toISOString().split('T')[0];

  return await prisma.reservation.findMany({
    where: {
      tableId,
      date: dateStr,
      status: { not: Status.CANCELLED }
    },
    select: {
        startHour: true,
        endHour: true
    }
  })
}
