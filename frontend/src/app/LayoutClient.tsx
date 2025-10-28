"use client";

import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/dashboard");

  return (
    <>
      {!isAdminPage && <Sidebar />}
      {children}
      <Toaster />
      {!isAdminPage && <Footer />}
    </>
  );
}
