// HackX3.0/frontend/src/components/Navbar.tsx
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import RegisterButton from "@/components/RegisterButton";
import { SidebarItem } from "../../types/team";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    window.location.href = path;
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="relative z-50 h-32 w-full">
        {/* This div previously held the Spline iframe. It is now removed as Spline is in Hero.tsx */}
        {/* The Navbar's content will now overlay the Spline in Hero.tsx */}

        <div className="flex h-full justify-between px-4 sm:px-8">
          <div className="flex w-sm items-center">
            <Image
              src="hackxlogo.svg"
              alt="HackX 3.0 Logo"
              width={140}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </div>

          <div className="relative hidden aspect-square w-full max-w-[900px] sm:block">
            {/* This div previously held the static image or Spline embed.
                It's now empty as Spline is moved to Hero.tsx for banner background. */}
          </div>

          {/* Register button for larger screens */}
          <div className="mt-10 hidden md:block">
            <RegisterButton />
          </div>

          {/* Hamburger menu button for smaller screens */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="relative z-50 flex h-12 w-12 flex-col items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <div
                className={`h-0.5 w-6 bg-white transition-all duration-300 ${isMenuOpen ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <div
                className={`my-1 h-0.5 w-6 bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
              />
              <div
                className={`h-0.5 w-6 bg-white transition-all duration-300 ${isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="absolute top-20 right-4 mt-4 w-80 max-w-[calc(100vw-2rem)]">
            <div className="rounded-3xl border border-white/10 bg-black/20 p-6 shadow-2xl backdrop-blur-md">
              <nav className="space-y-4">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <div
                      key={item.path}
                      className={`flex cursor-pointer items-center rounded-full px-4 py-3 transition-all duration-300 ${
                        isActive
                          ? "bg-white/90 shadow-lg backdrop-blur-sm"
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <div className="flex-shrink-0">
                        <Image
                          src={isActive ? item.darkIcon : item.icon}
                          alt={item.alt}
                          width={32}
                          height={32}
                          className={`h-8 w-8 ${
                            isActive
                              ? "filter-none"
                              : "brightness-0 invert filter"
                          }`}
                        />
                      </div>
                      <span
                        className={`ml-4 text-lg font-medium whitespace-nowrap ${
                          isActive ? "text-gray-800" : "text-white"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </nav>

              <div className="mt-6 border-t border-white/10 pt-4">
                <RegisterButton />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
