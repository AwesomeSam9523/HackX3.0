import jwt from "jsonwebtoken";
import type {JWTPayload} from "../types";
import ms from "ms";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "24h") as ms.StringValue;

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
};
