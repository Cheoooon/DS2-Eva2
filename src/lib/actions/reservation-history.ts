"use server"

import { prisma, Status } from "@/lib/prisma"
import { Prisma } from "../../prisma/generated/prisma/client"

export async function getReservationsHistory(params: { date?: string; sort?: 'asc' | 'desc' }) {
  const where: Prisma.ReservationWhereInput = {
    status: { not: Status.CANCELLED }
  }
  
  if (params.date) {
    where.date = params.date
  }
  
  return await prisma.reservation.findMany({
    where,
    include: { user: true, table: true },
    orderBy: { createdAt: params.sort === 'desc' ? 'desc' : 'asc' }
  })
}
