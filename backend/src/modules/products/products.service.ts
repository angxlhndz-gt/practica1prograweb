import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";
import { HttpError } from "../../common/http-error";
import { z } from "zod";
import {
  createProductSchema, listProductsSchema, updateProductSchema
} from "./products.schema";

type ProductListFilters = z.infer<typeof listProductsSchema>;
type NewProductData = z.infer<typeof createProductSchema>;
type ProductChanges = z.infer<typeof updateProductSchema>;

export async function findProducts(filters: ProductListFilters) {
  const productConditions: Prisma.ProductWhereInput = {
    ...(filters.search ? {
      OR: [
        { name: { contains: filters.search } },
        { sku: { contains: filters.search } },
        { description: { contains: filters.search } }
      ]
    } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
    ...(filters.isActive !== undefined ? { isActive: filters.isActive === "true" } : {}),
    ...(filters.minPrice !== undefined || filters.maxPrice !== undefined ? {
      price: {
        ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
        ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {})
      }
    } : {}),
    ...(filters.minStock !== undefined || filters.maxStock !== undefined ? {
      stock: {
        ...(filters.minStock !== undefined ? { gte: filters.minStock } : {}),
        ...(filters.maxStock !== undefined ? { lte: filters.maxStock } : {})
      }
    } : {}),
    ...(filters.lowStock === "true" ? { stock: { lte: 0 } } : {})
  };

  // lowStock compara stock contra minStock: se consulta y filtra para mantener la regla clara.
  if (filters.lowStock === "true") {
    delete productConditions.stock;
  }

  const sortConditions = { [filters.sortBy]: filters.sortOrder } as Prisma.ProductOrderByWithRelationInput;
  const recordsToSkip = (filters.page - 1) * filters.limit;

  const [productRecords, totalItems] = await prisma.$transaction([
    prisma.product.findMany({
      where: productConditions, orderBy: sortConditions, skip: recordsToSkip, take: filters.limit,
      include: { category: { select: { id: true, name: true } } }
    }),
    prisma.product.count({ where: productConditions })
  ]);

  const products = filters.lowStock === "true"
    ? productRecords.filter((product) => product.stock <= product.minStock)
    : productRecords;

  // Para lowStock se filtra correctamente antes de paginar y contar.
  if (filters.lowStock === "true") {
    const allLowStock = await prisma.product.findMany({
      where: { ...productConditions },
      orderBy: sortConditions,
      include: { category: { select: { id: true, name: true } } }
    });
    const lowStockProducts = allLowStock.filter((product) => product.stock <= product.minStock);
    const pagedProducts = lowStockProducts.slice(recordsToSkip, recordsToSkip + filters.limit);
    const totalPages = Math.ceil(lowStockProducts.length / filters.limit);
    return {
      data: pagedProducts,
      meta: {
        page: filters.page, limit: filters.limit, totalItems: lowStockProducts.length, totalPages,
        hasNextPage: filters.page < totalPages, hasPreviousPage: filters.page > 1
      }
    };
  }

  const totalPages = Math.ceil(totalItems / filters.limit);
  return {
    data: products,
    meta: {
      page: filters.page, limit: filters.limit, totalItems, totalPages,
      hasNextPage: filters.page < totalPages, hasPreviousPage: filters.page > 1
    }
  };
}

export async function findProductById(productId: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { category: { select: { id: true, name: true } } }
  });
  if (!product) throw new HttpError(404, "Producto no encontrado");
  return product;
}

export async function registerProduct(productData: NewProductData) {
  const category = await prisma.category.findUnique({ where: { id: productData.categoryId } });
  if (!category) throw new HttpError(400, "La categoría indicada no existe");
  if (!category.isActive) throw new HttpError(400, "La categoría está inactiva");

  return prisma.product.create({
    data: {
      ...productData,
      price: new Prisma.Decimal(productData.price),
      description: productData.description ?? null
    },
    include: { category: { select: { id: true, name: true } } }
  });
}

export async function editProduct(productId: number, productChanges: ProductChanges) {
  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) throw new HttpError(404, "Producto no encontrado");

  if (productChanges.categoryId !== undefined) {
    const category = await prisma.category.findUnique({ where: { id: productChanges.categoryId } });
    if (!category) throw new HttpError(400, "La categoría indicada no existe");
    if (!category.isActive) throw new HttpError(400, "La categoría está inactiva");
  }

  const data: Prisma.ProductUpdateInput = {
    ...(productChanges.sku !== undefined ? { sku: productChanges.sku } : {}),
    ...(productChanges.name !== undefined ? { name: productChanges.name } : {}),
    ...(productChanges.description !== undefined ? { description: productChanges.description } : {}),
    ...(productChanges.price !== undefined ? { price: new Prisma.Decimal(productChanges.price) } : {}),
    ...(productChanges.stock !== undefined ? { stock: productChanges.stock } : {}),
    ...(productChanges.minStock !== undefined ? { minStock: productChanges.minStock } : {}),
    ...(productChanges.isActive !== undefined ? { isActive: productChanges.isActive } : {}),
    ...(productChanges.categoryId !== undefined ? { category: { connect: { id: productChanges.categoryId } } } : {})
  };

  return prisma.product.update({
    where: { id: productId }, data,
    include: { category: { select: { id: true, name: true } } }
  });
}

export async function archiveProduct(productId: number) {
  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) throw new HttpError(404, "Producto no encontrado");
  if (!existing.isActive) return existing;
  return prisma.product.update({ where: { id: productId }, data: { isActive: false } });
}
