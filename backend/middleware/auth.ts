import type { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader } from "../utils/jwt";
import type { JWTPayload } from "../types";

export interface AuthRequest extends Request {
  user?: JWTPayload
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
};

export const requireSuperAdmin = requireRole(["SUPER_ADMIN"]);
export const requireAdmin = requireRole(["ADMIN", "SUPER_ADMIN"]);
export const requireJudge = requireRole(["JUDGE", "ADMIN", "SUPER_ADMIN"]);
export const requireMentor = requireRole(["MENTOR", "ADMIN", "SUPER_ADMIN"]);
export const requireParticipant = requireRole(["PARTICIPANT", "MENTOR", "JUDGE", "ADMIN", "SUPER_ADMIN"]);
