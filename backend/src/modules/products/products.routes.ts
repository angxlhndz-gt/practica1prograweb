import { Router } from "express";
import * as controller from "./products.controller";

export const productsRouter = Router();

productsRouter.get("/", controller.listProducts);
productsRouter.get("/:id", controller.getProductById);
productsRouter.post("/", controller.createProduct);
productsRouter.patch("/:id", controller.updateProduct);
productsRouter.delete("/:id", controller.deleteProduct);
