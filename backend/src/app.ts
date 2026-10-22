import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.json";
import { env } from "./config/env";
import { basicAuth } from "./common/basic-auth";
import { errorHandler } from "./common/error-handler";
import { productsRouter } from "./modules/products/products.routes";
import { categoriesRouter } from "./modules/categories/categories.routes";

export const app = express();

app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN.split(",").map((value) => value.trim()),
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "1mb" }));

app.get("/api/v1/health", (_req, res) => {
  res.json({ success: true, message: "API disponible", data: { status: "ok" }, meta: null });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", basicAuth);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoriesRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada", data: null, meta: null });
});

app.use(errorHandler);
