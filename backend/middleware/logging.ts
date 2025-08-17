import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import type { AuthRequest } from "./auth";

const prisma = new PrismaClient();

export const logActivity = (action: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Log the activity
      await prisma.activityLog.create({
        data: {
          userId: req.user?.userId || null,
          action,
          details: `${req.method} ${req.originalUrl}`,
          ipAddress: req.ip,
          userAgent: req.get("User-Agent") || null,
        },
      });
    } catch (error) {
      console.error("Failed to log activity:", error);
    }
    next();
  };
};

export const logError = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error("API Error:", {
    error: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  });

  res.status(500).json({
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { details: error.message }),
  });
};
