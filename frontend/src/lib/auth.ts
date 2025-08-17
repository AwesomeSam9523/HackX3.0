"use client"

import { jwtDecode } from "jwt-decode"

interface JWTPayload {
  sub: string
  username: string
  role: string
  teamId?: string
  exp: number
}

export class AuthService {
  private static instance: AuthService
  private token: string | null = null

  private constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("hackathon_token")
    }
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  setToken(token: string): void {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("hackathon_token", token)
    }
  }

  getToken(): string | null {
    return this.token
  }

  removeToken(): void {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("hackathon_token")
    }
  }

  isAuthenticated(): boolean {
    if (!this.token) return false

    try {
      const decoded = jwtDecode<JWTPayload>(this.token)
      return decoded.exp > Date.now() / 1000
    } catch {
      return false
    }
  }

  getUser(): JWTPayload | null {
    if (!this.token || !this.isAuthenticated()) return null

    try {
      return jwtDecode<JWTPayload>(this.token)
    } catch {
      return null
    }
  }

  hasRole(role: string): boolean {
    const user = this.getUser()
    return user?.role === role
  }

  logout(): void {
    this.removeToken()
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }
}

export const authService = AuthService.getInstance()
