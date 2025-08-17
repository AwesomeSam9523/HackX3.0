"use client";

import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ClientOnly from "@/components/ClientOnly";
import { usePathname } from "next/navigation";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && (
        <ClientOnly>
          <Sidebar />
        </ClientOnly>
      )}
      {children}
      {!isAdminPage && <Footer />}
    </>
  );
}
