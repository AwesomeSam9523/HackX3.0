"use client";
import React, { useState } from "react";
import { teamData } from "../../../data/teamData";
import CategoryTabs from "@/components/CategoryTabs";

import Navbar from "@/components/Navbar";
import TeamSubcategoryComponent from "@/components/TeamSubcategory";
import XComponent from "@/components/XComponent";
import Background from "@/components/Background";
import LightBoxTeams from "@/components/LightBoxTeams";

const TeamPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("FACULTY");
  const [activeYear, setActiveYear] = useState(2025);

  // Filter team data by selected year
  const filteredTeamData = teamData.filter(
    (category) => category.year === activeYear,
  );

  const categories = filteredTeamData.map((category) => category.name);
  const currentCategoryData = filteredTeamData.find(
    (category) => category.name === activeCategory,
  );

  // If no data for selected year and category, reset to first available category
  React.useEffect(() => {
    if (filteredTeamData.length > 0 && !currentCategoryData) {
      setActiveCategory(filteredTeamData[0].name);
    }
  }, [activeYear, filteredTeamData, currentCategoryData]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />
      <Navbar />
      <XComponent />
      <LightBoxTeams name={activeCategory} />
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="absolute top-8 left-8 hidden h-8 w-8 border-t-4 border-l-4 border-white md:block"></div>
        <div className="absolute top-8 right-8 hidden h-8 w-8 border-t-4 border-r-4 border-white md:block"></div>
        <div className="absolute bottom-8 left-8 hidden h-8 w-8 border-b-4 border-l-4 border-white md:block"></div>
        <div className="absolute right-8 bottom-8 hidden h-8 w-8 border-r-4 border-b-4 border-white md:block"></div>
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-5">
          <button className="font-avgardn text-offwhite rounded-full border-2 border-white bg-transparent px-4 py-3 text-sm font-bold tracking-wider uppercase transition-all duration-300 lg:mt-12 lg:px-10 lg:text-lg">
            MEET THE HUMANS BEHIND THE CURTAINS
          </button>
          <div className="font-kinetikaUltra text-offwhite mb-8 text-center text-5xl leading-[79.9%] font-black md:text-6xl">
            TEAM MUJ HACKX 3.0
          </div>
          {/* Year Selection Pill */}
          <div className="mb-8 flex items-center justify-center">
            <div className="flex rounded-full border-2 border-white bg-transparent p-1">
              <button
                onClick={() => setActiveYear(2025)}
                className={`cursor-pointer rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 ${
                  activeYear === 2025
                    ? "bg-white text-black hover:bg-gray-200"
                    : "text-white hover:bg-gray-800"
                }`}
              >
                2025
              </button>
              <button
                onClick={() => setActiveYear(2024)}
                className={`cursor-pointer rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 ${
                  activeYear === 2024
                    ? "bg-white text-black hover:bg-gray-200"
                    : "text-white hover:bg-gray-800"
                }`}
              >
                2024
              </button>
              <button
                onClick={() => setActiveYear(2023)}
                className={`cursor-pointer rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 ${
                  activeYear === 2023
                    ? "bg-white text-black hover:bg-gray-200"
                    : "text-white hover:bg-gray-800"
                }`}
              >
                2023
              </button>
            </div>
          </div>
        </div>
        {/* Category Tabs */}
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Team Members */}
        <div className="mx-auto max-w-7xl">
          {filteredTeamData.length === 0 ? (
            <div className="py-16 text-center">
              <h3 className="mb-4 text-2xl font-bold text-white">
                Team data for {activeYear} will be available soon!
              </h3>
              <p className="text-gray-400">
                Please check back later or select another year.
              </p>
            </div>
          ) : (
            currentCategoryData?.subcategories.map((subcategory, index) => (
              <TeamSubcategoryComponent
                key={`${activeCategory}-${activeYear}-${index}`}
                subcategory={subcategory}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
