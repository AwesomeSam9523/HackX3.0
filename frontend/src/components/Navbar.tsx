"use client";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import RegisterButton from "./RegisterButton";

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const sidebarItems = [
    {
      icon: "home.svg",
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
      darkIcon: "calenderDark.svg",
    },
    {
      icon: "ambassador.svg",
      alt: "Favorites",
      label: "Ambassador",
      path: "/ambassador",
      darkIcon: "ambassadorDark.svg",
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
      darkIcon: "galleryDark.svg",
    },
    {
      icon: "contact.svg",
      alt: "contact",
      label: "Contact Us",
      path: "/contact",
      darkIcon: "contactDark.svg",
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
      <div className="relative z-7 h-32 w-full">
        <div className="flex h-full justify-between px-4 pt-24 sm:px-8 sm:pt-0">
          <div className="flex w-sm items-center">
            <Image
              src="muj-logo.svg"
              alt="MUJ Logo"
              width={120}
              height={48}
              className="h-10 w-auto pr-2 pb-1"
              priority
            />
            <Image
              src="hackxlogo.svg"
              alt="HackX 3.0 Logo"
              width={140}
              height={48}
              className="h-12 w-auto"
              priority
            />
          </div>

          <div className="relative hidden aspect-square w-full max-w-[900px] sm:block" />

          <div className="mt-10 hidden md:block">
            <RegisterButton />
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="relative z-50 flex h-12 w-12 flex-col items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
              aria-label="Toggle menu"
            >
              <div
                className={`h-0.5 w-6 transform bg-white transition-all duration-300 ${
                  isMenuOpen ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <div
                className={`my-1 h-0.5 w-6 bg-white transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <div
                className={`h-0.5 w-6 transform bg-white transition-all duration-300 ${
                  isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-lg transition-opacity duration-500 ease-in-out md:hidden ${
          isMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        {/* Backdrop - Transparent */}
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sliding Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-3/4 max-w-md transform transition-transform duration-500 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full rounded-l-3xl border-t border-b border-l border-white/20 bg-black/20 p-6 shadow-2xl">
            {/* Close Button */}
            {/* <div className="flex justify-end mb-8">
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm transition-all duration-300 hover:bg-white/25"
                aria-label="Close menu"
              >
                <span className="text-white text-xl font-bold">×</span>
              </button>
            </div> */}

            {/* Nav Items */}
            <div className="mt-8 rounded-4xl bg-white/15 p-4">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <div
                      key={item.path}
                      className={`flex cursor-pointer items-center transition-all duration-300 ${
                        isActive
                          ? "rounded-3xl border border-gray-300 bg-amber-50/95 px-4 py-2 text-gray-800 shadow-lg backdrop-blur-sm"
                          : "px-4 py-2 text-white hover:bg-white/15"
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <div className="flex-shrink-0">
                        <Image
                          src={`/pathIcons/${isActive ? item.darkIcon : item.icon}`}
                          alt={item.alt}
                          width={24}
                          height={24}
                          className={`h-6 w-6 ${
                            isActive
                              ? "filter-none"
                              : "brightness-0 invert filter"
                          }`}
                        />
                      </div>
                      <span className="ml-4 text-base font-medium whitespace-nowrap">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Register Button Inline */}
            <div className="mt-4">
              <button className="w-full rounded-3xl border border-white bg-transparent px-6 py-2 text-sm font-semibold text-white uppercase transition-all duration-300 hover:bg-white hover:text-black">
                Register Now
              </button>
            </div>

            {/* Social Media Icons */}
            <div className="mt-4 pb-4">
              <div className="rounded-4xl bg-white/15 p-3 backdrop-blur-sm">
                <div className="flex justify-center space-x-6">
                  {[
                    { icon: "globe.svg", alt: "Website" },
                    { icon: "instagram.svg", alt: "Instagram" },
                    { icon: "linkedin.svg", alt: "LinkedIn" },
                  ].map((social) => (
                    <button
                      key={social.alt}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-all duration-300 hover:bg-white/25"
                    >
                      <Image
                        src={`/${social.icon}`}
                        alt={social.alt}
                        width={16}
                        height={16}
                        className="h-4 w-4 brightness-0 invert filter"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
