import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

type AdminTokenPayload = {
  sub: string;
  exp: number;
};

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN_SECRET = process.env.ADMIN_TOKEN_SECRET || "change-this-admin-token-secret";
const TOKEN_TTL_SECONDS = 60 * 60 * 12;

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signPayload(encodedPayload: string): string {
  return crypto.createHmac("sha256", ADMIN_TOKEN_SECRET).update(encodedPayload).digest("base64url");
}

export function createAdminToken(username: string): string {
  const payload: AdminTokenPayload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  const parts = token.split(".");

  if (parts.length !== 2) {
    return null;
  }

  const [encodedPayload, signature] = parts;
  const expectedSignature = signPayload(encodedPayload);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(encodedPayload)) as AdminTokenPayload;
    const now = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function validateAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function readAdminTokenFromRequest(req: Request): string | null {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
}

export function isAdminRequest(req: Request): boolean {
  const token = readAdminTokenFromRequest(req);

  if (!token) {
    return false;
  }

  return verifyAdminToken(token) !== null;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = readAdminTokenFromRequest(req);

  if (!token) {
    res.status(401).json({ message: "Admin authentication required." });
    return;
  }

  const payload = verifyAdminToken(token);

  if (!payload) {
    res.status(401).json({ message: "Invalid or expired admin token." });
    return;
  }

  next();
}
