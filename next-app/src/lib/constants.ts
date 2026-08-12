import { Status } from "../../prisma/generated/prisma/client";

export const STATUS_LABELS: Record<Status, string> = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En proceso',
  COMPLETED: 'Realizado',
  CANCELLED: 'Cancelado',
  MOVED: 'Cambiado de mesa'
};

export const STATUS_COLORS: Record<Status, string> = {
  PENDING: 'bg-slate-200 text-slate-800',
  IN_PROGRESS: 'bg-yellow-200 text-yellow-900',
  COMPLETED: 'bg-green-200 text-green-900',
  CANCELLED: 'bg-red-200 text-red-900',
  MOVED: 'bg-blue-200 text-blue-900'
};
