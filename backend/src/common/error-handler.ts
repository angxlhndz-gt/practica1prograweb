import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { HttpError } from "./http-error";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      data: null,
      meta: null,
      ...(error.details ? { errors: error.details } : {})
    });
  }

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Error de validación",
      data: null,
      meta: null,
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false, message: "Ya existe un registro con uno de los valores únicos",
        data: null, meta: null
      });
    }
    if (error.code === "P2003") {
      return res.status(409).json({
        success: false, message: "No se puede completar la operación por una relación existente",
        data: null, meta: null
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false, message: "No se encontró el registro solicitado",
        data: null, meta: null
      });
    }
  }

  console.error(error);
  return res.status(500).json({
    success: false,
    message: "Ocurrió un error interno",
    data: null,
    meta: null
  });
};
