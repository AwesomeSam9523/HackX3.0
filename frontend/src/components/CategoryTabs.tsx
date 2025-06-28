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
    <div className="mb-12 flex justify-center px-2">
      <div className="flex rounded-full bg-transparent p-2 border-2 border-white">
        
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full px-2 md:px-4 py-3 text-lg md:text-xl tracking-tight transition-all duration-300 mx-1 font-bold cursor-pointer ${
              activeCategory === category
                ? "bg-white text-gray-900"
                : "text-white hover:bg-gray-800"
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
