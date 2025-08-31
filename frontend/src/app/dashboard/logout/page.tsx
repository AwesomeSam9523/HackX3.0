"use client";

import Link from 'next/link';
import { authService } from "@/lib/auth";
import { useEffect } from "react";

function Logout() {
  const handleLogout = async () => {
    try {
      authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    handleLogout();
  })

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">You have been logged out</h1>
        <p className="mb-6">Thank you for using our service!</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default Logout;