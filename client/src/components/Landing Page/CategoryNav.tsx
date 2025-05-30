import React from "react";

const CategoryNav: React.FC = () => {
  const categories = [
    "Furniture",
    "Sofas & Seating",
    "Mattresses",
    "Home Decor",
    "Furnishings",
    "Lamps & Lighting",
    "Kitchen & Dining",
    "Luxury",
    "Modular",
  ];
  return (
    <div>
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-8 py-4">
            {categories.map((category) => (
              <a
                key={category}
                href="#"
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryNav;
