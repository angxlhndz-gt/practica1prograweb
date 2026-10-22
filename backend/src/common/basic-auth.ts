import { NextFunction, Request, Response } from "express";
import { timingSafeEqual } from "node:crypto";
import { env } from "../config/env";

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/**
 * HTTP Basic Authentication para aprendizaje y pruebas locales.
 * Basic codifica las credenciales en Base64; no las cifra. Usa HTTPS fuera de localhost.
 */
export function basicAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");

  if (!header?.startsWith("Basic ")) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Products API", charset="UTF-8"');
    return res.status(401).json({
      success: false,
      message: "Autenticación requerida",
      data: null,
      meta: null
    });
  }

  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) throw new Error("Formato inválido");

    const username = decoded.slice(0, separator);
    const password = decoded.slice(separator + 1);
    const valid = safeEqual(username, env.BASIC_AUTH_USERNAME) &&
      safeEqual(password, env.BASIC_AUTH_PASSWORD);

    if (!valid) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Products API", charset="UTF-8"');
      return res.status(401).json({
        success: false,
        message: "Credenciales incorrectas",
        data: null,
        meta: null
      });
    }

    return next();
  } catch {
    res.setHeader("WWW-Authenticate", 'Basic realm="Products API", charset="UTF-8"');
    return res.status(401).json({
      success: false,
      message: "Encabezado de autenticación inválido",
      data: null,
      meta: null
    });
  }
}
