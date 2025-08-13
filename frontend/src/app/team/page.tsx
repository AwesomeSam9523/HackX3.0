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

  const categories = teamData.map((category) => category.name);
  const currentCategoryData = teamData.find(
    (category) => category.name === activeCategory,
  );

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
          <button className="font-avgardn text-offwhite rounded-full border-2 border-white bg-transparent px-4 py-3 text-sm font-bold tracking-wider uppercase transition-all duration-300 lg:mt-20 lg:px-10 lg:text-lg">
            MEET THE HUMANS BEHIND THE CURTAINS
          </button>
          <div className="font-kinetikaUltra text-offwhite mb-8 text-center text-5xl leading-[79.9%] font-black md:text-6xl">
            TEAM MUJ HACKX 3.0
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
          {currentCategoryData?.subcategories.map((subcategory, index) => (
            <TeamSubcategoryComponent
              key={`${activeCategory}-${index}`}
              subcategory={subcategory}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
