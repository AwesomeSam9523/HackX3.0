import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import ClientOnly from "@/components/ClientOnly";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kinetikaLight = localFont({
  src: "../../public/fonts/KinetikaLight.otf",
  variable: "--font-kinetika-light",
});

const kinetikaUltra = localFont({
  src: "../../public/fonts/KinetikaUltra.otf",
  variable: "--font-kinetika-ultra",
});

export const metadata: Metadata = {
  title: "HACKX 3.0",
  description: "MUJ's LARGEST HACKATHON",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kinetikaLight.variable} ${kinetikaUltra.variable} antialiased`}
      >
        <ClientOnly>
          <Sidebar />
        </ClientOnly>
        {children}
        <Footer />
      </body>
    </html>
  );
}
