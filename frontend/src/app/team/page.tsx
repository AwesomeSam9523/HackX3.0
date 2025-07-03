"use client";
import React, { useState } from "react";
import { teamData } from "../../../data/teamData";
import CategoryTabs from "@/components/CategoryTabs";

import Navbar from "@/components/Navbar";
import TeamSubcategoryComponent from "@/components/TeamSubcategory";
import XComponent from "@/components/XComponent";

const TeamPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("FACULTY");

  const categories = teamData.map((category) => category.name);
  const currentCategoryData = teamData.find(
    (category) => category.name === activeCategory,
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 via-black to-black">
      <Navbar />
      <XComponent />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="absolute top-8 left-8 hidden h-8 w-8 border-t-4 border-l-4 border-white md:block"></div>
        <div className="absolute top-8 right-8 hidden h-8 w-8 border-t-4 border-r-4 border-white md:block"></div>
        <div className="absolute bottom-8 left-8 hidden h-8 w-8 border-b-4 border-l-4 border-white md:block"></div>
        <div className="absolute right-8 bottom-8 hidden h-8 w-8 border-r-4 border-b-4 border-white md:block"></div>
        {/* Header */}
        <div className="mt-10 mb-12 text-center">
          <div className="mb-6 inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-3 font-extrabold">
            <span className="text-xl font-extrabold tracking-tight text-white">
              MEET THE HUMANS BEHIND THE CURTAINS
            </span>
          </div>
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight text-white md:text-7xl">
            TEAM MUJ HACKX 3.0
          </h1>
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
