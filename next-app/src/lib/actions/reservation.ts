"use server"

import { auth } from "../auth"
import { prisma, Status } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { reservationSchema } from "@/lib/schemas"

export async function createReservation(rawData: unknown) {
  const data = reservationSchema.parse(rawData);
  const table = await prisma.table.findUnique({ where: { id: data.tableId } });
  if (!table || !table.active) {
    throw new Error("No puede crear una reserva en esta mesa, se encuentra inhabilitada");
  }

  const existing = await prisma.reservation.findFirst({
    where: {
      tableId: data.tableId,
      date: data.date,
      status: { notIn: [Status.CANCELLED, Status.MOVED] },
      startHour: { lt: data.endHour },
      endHour: { gt: data.startHour }
    }
  });

  if (existing) {
    throw new Error("Mesa no disponible en este horario.");
  }
  
  await prisma.reservation.create({ 
      data: {
          ...data
      } 
  });
  
  revalidatePath("/reservations");
}

export async function getReservations(options: { date?: string, sort?: 'asc' | 'desc', tableId?: string } = {}) {
  const where: any = {}
  if (options.date) where.date = options.date
  if (options.tableId) where.tableId = options.tableId
  
  return await prisma.reservation.findMany({
    where,
    include: { user: true, table: true },
    orderBy: { createdAt: options.sort || 'desc' }
  })
}

export async function getReservationById(id: string) {
    return await prisma.reservation.findUnique({
        where: { id },
        include: { table: true }
    })
}

export async function updateReservation(id: string, data: any) {
  console.log("DEBUG: Datos de updateReservation recibidos:", JSON.stringify(data, null, 2));
  const oldReservation = await prisma.reservation.findUnique({ where: { id } })
  if (!oldReservation) throw new Error("Reserva no encontrada")

  const status = data.status === 'MOVED' ? oldReservation.status : (data.status as Status)

  // Si cambia de mesa, lógica especial
  if (oldReservation.tableId !== data.tableId) {
      // 1. Verificar disponibilidad en la nueva mesa
      const existing = await prisma.reservation.findFirst({
        where: {
          tableId: data.tableId,
          date: data.date,
          status: { notIn: [Status.CANCELLED, Status.MOVED] },
          startHour: { lt: data.endHour },
          endHour: { gt: data.startHour }
        }
      });
      if (existing) throw new Error("Mesa no disponible.");

      // 2. Transacción
      await prisma.$transaction([
          prisma.reservation.update({ where: { id }, data: { status: Status.MOVED } }),
          prisma.reservation.create({ data: { 
            tableId: data.tableId,
            date: data.date,
            startHour: data.startHour,
            endHour: data.endHour,
            customerName: data.customerName,
            occupants: data.occupants,
            notes: data.notes,
            status: status,
            userId: oldReservation.userId 
          } })
      ])
  } else {
      // Solo actualización normal
      await prisma.reservation.update({ 
        where: { id }, 
        data: {
            tableId: data.tableId,
            date: data.date,
            startHour: data.startHour,
            endHour: data.endHour,
            customerName: data.customerName,
            occupants: data.occupants,
            notes: data.notes,
            status: status
        } 
      })
  }

  revalidatePath("/reservations")
  revalidatePath("/reservations/history")
}

export async function deleteReservation(id: string) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') throw new Error("No autorizado")
  
  await prisma.reservation.delete({ where: { id } })
  revalidatePath("/reservations")
  revalidatePath("/reservations/history")
}

export async function updateReservationStatus(id: string, status: Status) {
  await prisma.reservation.update({ 
    where: { id }, 
    data: { status } 
  })
  revalidatePath("/reservations")
  revalidatePath("/reservations/history")
}

export async function getReservationsByDate(date: Date) {
  const dateStr = date.toISOString().split('T')[0];

  return await prisma.reservation.findMany({
    where: {
      date: dateStr,
      status: { notIn: [Status.CANCELLED, Status.MOVED] }
    },
    include: { user: true, table: true },
    orderBy: { startHour: 'asc' }
  })
}
