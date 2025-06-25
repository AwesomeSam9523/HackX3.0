"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarItem {
  icon: string;
  alt: string;
  label: string;
  path: string;
  darkIcon: string;
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      icon: "house.svg",
      alt: "Home",
      label: "Home",
      path: "/",
      darkIcon: "homeDark.svg",
    },
    {
      icon: "information.svg",
      alt: "Info",
      label: "About Us",
      path: "/information",
      darkIcon: "informationDark.svg",
    },
    {
      icon: "calender.svg",
      alt: "Calendar",
      label: "Timeline",
      path: "/calender",
      darkIcon: "calender.svg",
    },
    {
      icon: "ambassador.svg",
      alt: "Favorites",
      label: "Ambassador",
      path: "/ambassador",
      darkIcon: "ambassador.svg",
    },
    {
      icon: "team.svg",
      alt: "Team",
      label: "Team",
      path: "/team",
      darkIcon: "teamDark.svg",
    },
    {
      icon: "gallery.svg",
      alt: "Gallery",
      label: "Gallery",
      path: "/gallery",
      darkIcon: "gallery.svg",
    },
    {
      icon: "faq.svg",
      alt: "FAQ",
      label: "FAQs",
      path: "/faq",
      darkIcon: "faqDark.svg",
    },
  ];

  return (
    <div className="fixed top-1/2 left-6 z-50 -translate-y-1/2 transform">
      {/* Sidebar Container with Blur Background */}
      <div
        className={`border border-white/10 shadow-2xl backdrop-blur-md transition-all duration-500 ease-in-out ${
          isHovered ? "rounded-2xl px-6 py-8" : "rounded-full px-4 py-8"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <nav className="flex flex-col space-y-8">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.path}
                className={`flex cursor-pointer items-center rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-white/90 shadow-lg backdrop-blur-sm"
                    : "hover:bg-white/10"
                } ${isHovered ? "px-4 py-3" : "p-4"}`}
                onClick={() => {
                  window.location.href = item.path;
                }}
              >
                <div className="flex-shrink-0">
                  <Image
                    src={isActive ? item.darkIcon : item.icon}
                    alt={item.alt}
                    width={32}
                    height={32}
                    className={`h-8 w-8 ${
                      isActive
                        ? "filter-none" // Active: original color (uses darkIcon)
                        : "brightness-0 invert filter" // Inactive: pure white (uses normal icon)
                    }`}
                  />
                </div>

                {/* Label that slides in/out */}
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isHovered
                      ? "ml-4 max-w-xs opacity-100"
                      : "ml-0 max-w-0 opacity-0"
                  }`}
                >
                  <span
                    className={`text-lg font-medium whitespace-nowrap ${
                      isActive ? "text-gray-800" : "text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
