"use client";

import { authService } from "./auth";

const WS_URL =
  (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:9000") + "/ws";

class WebsocketService {
  ws: WebSocket | null = null;

  async connect(retrying = false): Promise<WebSocket> {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Unauthorized");
    }
    return new Promise<WebSocket>((resolve, reject) => {
      this.ws = new WebSocket(WS_URL);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        if (!this.ws) return;
        resolve(this.ws);
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        reject(error);
      };

      this.ws.onclose = (event) => {
        console.log("WebSocket closed:", event);
        if (!retrying) this.connect(true);
      };
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  async reconnect() {
    if (this.ws) {
      this.ws.close();
    }
    return this.connect(true);
  }
}

export const wsService = new WebsocketService();
