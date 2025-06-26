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
    <div className="mb-12 flex justify-center">
      <div className="flex rounded-full bg-transparent p-2 border-4 border-white">
        
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`rounded-full px-4 py-3 text-xl tracking-tight transition-all duration-300 mx-1 font-bold ${
              activeCategory === category
                ? "bg-white text-gray-900"
                : "text-white hover:bg-gray-700"
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
