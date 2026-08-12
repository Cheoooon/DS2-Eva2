import { Status } from "../../prisma/generated/prisma/client";

export const STATUS_LABELS: Record<Status, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En proceso',
  COMPLETED: 'Realizado',
  CANCELLED: 'Cancelado',
  MOVED: 'Cambiado de mesa'
};
