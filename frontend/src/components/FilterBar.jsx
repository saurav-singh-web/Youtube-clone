import { categories } from "../data/categories";

function FilterBar({ selectedCategory, onSelectCategory }) {
  return (
    <div className="sticky top-16 z-10 flex gap-3 pb-4 pt-4 overflow-x-auto bg-white whitespace-nowrap hide-scrollbar" aria-label="Video categories">
      {categories.map((category) => (
        <button
          className={`flex-none px-4 py-1.5 rounded-lg font-medium transition-colors ${
            category === selectedCategory 
              ? "bg-black text-white" 
              : "bg-gray-100 text-gray-900 hover:bg-gray-200"
          }`}
          type="button"
          key={category}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;

