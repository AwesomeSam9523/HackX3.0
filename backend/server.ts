import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import {WebSocket, WebSocketServer} from "ws";
import jwt from "jsonwebtoken";
import {PrismaClient} from "@prisma/client";

// Import middleware
import {logError} from "./middleware/logging";

// Import routes
import authRoutes from "./routes/auth";
import superAdminRoutes from "./routes/superAdmin";
import adminRoutes from "./routes/admin";
import judgeRoutes from "./routes/judge";
import mentorRoutes from "./routes/mentor";
import teamRoutes from "./routes/team";

// Load environment variables
dotenv.config();

const app = express();
const wss = new WebSocketServer({port: 9000})
const PORT = process.env.PORT || 4000;
const prisma = new PrismaClient();

interface AuthenticatedWebSocket extends WebSocket {
  id?: string
  userRole?: string
}

interface WebSocketMessage {
  type: "authenticate" | "checkpoint" | "subscribe_checkpoints";
  data?: any;
  token?: string;
  checkpoint?: any;
}

const clients = new Map<string, AuthenticatedWebSocket>()
const admins: AuthenticatedWebSocket[] = [];
// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: {policy: "cross-origin"},
  }),
);

// CORS configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Body parsing middleware
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));

// Logging middleware
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("combined"));
}

// Rate limiting
// app.use("/api", apiLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/super-admin", superAdminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/judges", judgeRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/teams", teamRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Global error handler
app.use(logError);

// Database connection test
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🔄 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🔄 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
async function startServer() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  });
}

wss.on("connection", (ws: AuthenticatedWebSocket) => {
  console.log("New WebSocket connection");
  setTimeout(function check() {
    if (!ws.id) {
      ws.close();
      console.log("WebSocket connection closed due to authentication timeout");
    }
  }, 2000);

  ws.on("message", async (message: Buffer) => {
    try {
      const parsedMessage: WebSocketMessage = JSON.parse(message.toString())

      if (parsedMessage.type === "authenticate" && parsedMessage.token) {
        try {
          const decoded = jwt.verify(parsedMessage.token, process.env.JWT_SECRET!) as any
          ws.id = decoded.id;
          ws.userRole = decoded.role;

          // Store authenticated client
          clients.set(decoded.id, ws);

          ws.send(
            JSON.stringify({
              type: "authenticated",
              data: {userId: decoded.id, role: decoded.role},
            }),
          );

          console.log(`User ${decoded.id} authenticated via WebSocket`);
        } catch (error) {
          console.error("WebSocket authentication error:", error);
          ws.send(
            JSON.stringify({
              type: "error",
              data: {message: "Authentication failed"},
            }),
          );
          ws.close();
        }
      }

      // Handle other message types based on user role
      if (ws.id && ws.userRole) {
        await handleMessage(ws, parsedMessage);
      } else {
        ws.close();
      }
    } catch (error) {
      console.error("WebSocket message error:", error);
      ws.send(
        JSON.stringify({
          type: "error",
          data: {message: "Invalid message format"},
        }),
      );
    }
  })

  ws.on("close", () => {
    if (ws.id) {
      clients.delete(ws.id)
    }
    if (admins.includes(ws)) {
      const index = admins.indexOf(ws);
      if (index > -1) {
        admins.splice(index, 1);
      }
    }
    console.log(`User ${ws.id} disconnected`);
  });
})

async function handleMessage(ws: AuthenticatedWebSocket, message: WebSocketMessage) {
  switch (message.type) {
    case "subscribe_checkpoints":
      if (ws.userRole === "ADMIN" || ws.userRole === "SUPER_ADMIN") {
        // Subscribe to real-time notifications
        admins.push(ws);
        ws.send(
          JSON.stringify({
            type: "subscribed",
            channel: "checkpoints",
          }),
        );
      }
      break;

    case "checkpoint":
      if (ws.userRole === "ADMIN" || ws.userRole === "SUPER_ADMIN") {
        // Subscribe to real-time notifications
        const checkpoint = message.checkpoint;
        broadcastToOtherAdmins({
          type: "checkpoint",
          checkpoint,
        }, ws);
      }
      break;
  }
}

// Broadcast functions for different events
export function broadcastToRole(role: string, message: any) {
  clients.forEach((client) => {
    if (client.userRole === role && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

export function broadcastToUser(userId: string, message: any) {
  const client = clients.get(userId)
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message))
  }
}

export function broadcastToAll(message: any) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  })
}

export function broadcastToOtherAdmins(message: any, host: AuthenticatedWebSocket) {
  for (const admin of admins) {
    if (admin.id !== host.id && admin.readyState === WebSocket.OPEN) {
      admin.send(JSON.stringify(message))
    }
  }
}


startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
