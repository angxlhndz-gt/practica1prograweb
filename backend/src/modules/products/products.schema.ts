import { z } from "zod";

const positiveId = z.coerce.number().int().positive();

export const productIdSchema = z.object({ id: positiveId });

export const listProductsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(150).optional(),
  categoryId: positiveId.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minStock: z.coerce.number().int().min(0).optional(),
  maxStock: z.coerce.number().int().min(0).optional(),
  isActive: z.enum(["true", "false"]).optional(),
  lowStock: z.enum(["true", "false"]).optional(),
  sortBy: z.enum(["name", "sku", "price", "stock", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc")
}).refine((v) => v.minPrice === undefined || v.maxPrice === undefined || v.minPrice <= v.maxPrice, {
  message: "minPrice no puede ser mayor que maxPrice",
  path: ["minPrice"]
}).refine((v) => v.minStock === undefined || v.maxStock === undefined || v.minStock <= v.maxStock, {
  message: "minStock no puede ser mayor que maxStock",
  path: ["minStock"]
});

export const createProductSchema = z.object({
  sku: z.string().trim().min(1).max(50),
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().max(5000).nullable().optional(),
  price: z.coerce.number().positive().max(99999999.99),
  stock: z.coerce.number().int().min(0).default(0),
  minStock: z.coerce.number().int().min(0).default(0),
  categoryId: positiveId,
  isActive: z.boolean().default(true)
});

export const updateProductSchema = createProductSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "Debe enviar al menos un campo para actualizar" }
);
