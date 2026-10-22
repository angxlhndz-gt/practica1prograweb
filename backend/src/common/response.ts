import { Response } from "express";

export function success<T>(
  res: Response,
  data: T,
  message = "Operación realizada correctamente",
  statusCode = 200,
  meta: unknown = null
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  });
}
