"use client";

import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/dashboard");

  return (
    <>
      {!isAdminPage && <Sidebar />}
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
}
