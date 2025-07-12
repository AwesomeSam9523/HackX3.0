import React from "react";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="mb-12 flex justify-center px-1 lg:px-2">
      <div className="flex gap-1 rounded-full border-2 border-white bg-transparent p-1 lg:p-2">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`cursor-pointer rounded-full px-2 py-2 text-sm font-bold tracking-tight transition-all duration-300 md:px-4 md:text-xl lg:py-3 lg:text-lg ${
              activeCategory === category
                ? "bg-white text-gray-900"
                : "text-offwhite hover:bg-gray-800"
            }`}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
