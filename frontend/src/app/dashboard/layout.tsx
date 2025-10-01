import type React from "react"
import "../globals.css"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="dashboard-container">{children}</div>
}
