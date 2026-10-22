import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../config/prisma";
import { asyncHandler } from "../../common/async-handler";
import { success } from "../../common/response";
import { HttpError } from "../../common/http-error";

export const categoriesRouter = Router();

categoriesRouter.get("/", asyncHandler(async (req, res) => {
  const query = z.object({
    includeInactive: z.enum(["true", "false"]).default("false")
  }).parse(req.query);

  const categories = await prisma.category.findMany({
    where: query.includeInactive === "true" ? {} : { isActive: true },
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } }
  });

  return success(res, categories, "Categorías obtenidas correctamente");
}));

categoriesRouter.post("/", asyncHandler(async (req, res) => {
  const input = z.object({
    name: z.string().trim().min(2).max(100),
    description: z.string().trim().max(500).nullable().optional()
  }).parse(req.body);

  const category = await prisma.category.create({ data: input });
  return success(res, category, "Categoría creada correctamente", 201);
}));

categoriesRouter.patch("/:id", asyncHandler(async (req, res) => {
  const { id } = z.object({ id: z.coerce.number().int().positive() }).parse(req.params);
  const input = z.object({
    name: z.string().trim().min(2).max(100).optional(),
    description: z.string().trim().max(500).nullable().optional(),
    isActive: z.boolean().optional()
  }).refine((v) => Object.keys(v).length > 0, { message: "Debe enviar al menos un campo" }).parse(req.body);

  const exists = await prisma.category.findUnique({ where: { id } });
  if (!exists) throw new HttpError(404, "Categoría no encontrada");

  const category = await prisma.category.update({ where: { id }, data: input });
  return success(res, category, "Categoría actualizada correctamente");
}));
