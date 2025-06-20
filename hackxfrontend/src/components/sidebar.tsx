"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

interface SidebarItem {
  icon: string;
  alt: string;
  path: string;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const sidebarItems: SidebarItem[] = [
    { icon: "house.svg", alt: "Home", path: "/" },
    { icon: "information.svg", alt: "Info", path: "/information" },
    { icon: "calender.svg", alt: "Calendar", path: "/calender" },
    { icon: "ambassador.svg", alt: "Favorites", path: "/ambassador" },
    { icon: "team.svg", alt: "Team", path: "/team" },
    { icon: "gallery.svg", alt: "Gallery", path: "/gallery" },
    { icon: "faq.svg", alt: "FAQ", path: "/faq" },
  ];

  return (
    <div className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50">
      {/* Sidebar Container with Blur Background */}
      <div className="backdrop-blur-md rounded-full px-4 py-8 shadow-2xl bg-blue-900/20 border border-white/10">
        <nav className="flex flex-col items-center space-y-8">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.path}
                className={`p-4 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-white/90 backdrop-blur-sm shadow-lg"
                    : "hover:bg-white/10"
                }`}
                onClick={() => {
                  window.location.href = item.path;
                }}
              >
                <Image
                  src={item.icon}
                  alt={item.alt}
                  width={32}
                  height={32}
                  className={`w-8 h-8 ${
                    isActive 
                      ? "filter-none" // Active: original color (black)
                      : "filter invert brightness-0" // Inactive: pure white
                  }`}
                />
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;