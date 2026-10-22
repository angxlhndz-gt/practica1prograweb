import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL es obligatorio"),
  CORS_ORIGIN: z.string().default("http://localhost:4200"),
  BASIC_AUTH_USERNAME: z.string().min(1, "BASIC_AUTH_USERNAME es obligatorio"),
  BASIC_AUTH_PASSWORD: z.string().min(1, "BASIC_AUTH_PASSWORD es obligatorio")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Variables de entorno inválidas:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
