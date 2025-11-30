'use client';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={() => onSelectCategory('All')}
        className={`px-4 h-10 rounded-lg text-sm font-medium transition-all duration-150 ${
          selectedCategory === 'All'
            ? 'bg-primary text-primary-foreground'
            : 'bg-background border border-border text-foreground hover:border-border-medium'
        }`}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-4 h-10 rounded-lg text-sm font-medium transition-all duration-150 ${
            selectedCategory === category
              ? 'bg-primary text-primary-foreground'
              : 'bg-background border border-border text-foreground hover:border-border-medium'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};