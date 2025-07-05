"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SidebarItem } from "../../types/team";

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
      path: "/about",
      darkIcon: "informationDark.svg",
    },
    {
      icon: "calender.svg",
      alt: "Calendar",
      label: "Timeline",
      path: "/timeline",
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
    <div
      className="fixed z-50 hidden md:block"
      style={{
        top: "50%",
        left: "24px",
        transform: "translateY(-50%)",
        width: "auto",
        height: "auto",
        borderRadius: isHovered ? "16px" : "9999px",
        transition: "all 0.5s ease-in-out",
      }}
    >
      <div
        className={`h-full w-full rounded-[42px] border border-white/10 bg-white/10 px-4 py-8 shadow-2xl transition-all duration-500 ease-in-out`}
        style={{ backdropFilter: "blur(59.900001525878906px)" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <nav className="flex flex-col space-y-6">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <div
                key={item.path}
                className={`flex cursor-pointer items-center rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-white/90 shadow-lg backdrop-blur-sm"
                    : "hover:bg-white/10"
                } p-4`}
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
                      isActive ? "filter-none" : "brightness-0 invert filter"
                    }`}
                  />
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isHovered
                      ? "ml-4 w-auto opacity-100"
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
