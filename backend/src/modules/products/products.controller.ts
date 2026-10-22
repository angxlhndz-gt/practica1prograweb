import { Request, Response } from "express";
import { success } from "../../common/response";
import { asyncHandler } from "../../common/async-handler";
import {
  createProductSchema, listProductsSchema, productIdSchema, updateProductSchema
} from "./products.schema";
import * as service from "./products.service";

export const listProducts = asyncHandler(async (request: Request, response: Response) => {
  const filters = listProductsSchema.parse(request.query);
  const result = await service.findProducts(filters);
  return success(response, result.data, "Productos obtenidos correctamente", 200, result.meta);
});

export const getProductById = asyncHandler(async (request: Request, response: Response) => {
  const { id: productId } = productIdSchema.parse(request.params);
  return success(response, await service.findProductById(productId), "Producto obtenido correctamente");
});

export const createProduct = asyncHandler(async (request: Request, response: Response) => {
  const productData = createProductSchema.parse(request.body);
  return success(response, await service.registerProduct(productData), "Producto creado correctamente", 201);
});

export const updateProduct = asyncHandler(async (request: Request, response: Response) => {
  const { id: productId } = productIdSchema.parse(request.params);
  const productChanges = updateProductSchema.parse(request.body);
  return success(response, await service.editProduct(productId, productChanges), "Producto actualizado correctamente");
});

export const deleteProduct = asyncHandler(async (request: Request, response: Response) => {
  const { id: productId } = productIdSchema.parse(request.params);
  await service.archiveProduct(productId);
  return response.status(204).send();
});
