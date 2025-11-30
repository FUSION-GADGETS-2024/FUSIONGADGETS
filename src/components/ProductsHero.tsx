import { Button } from "./ui/button";

interface ProductsHeroProps {
  categoryName: string;
  categoryImage: string;
}

export const ProductsHero = ({ categoryName, categoryImage }: ProductsHeroProps) => {
  return (
    <section className="relative pt-16 bg-background overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${categoryImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-8 relative z-10">
        <div className="flex flex-col items-center justify-center text-center py-20 md:py-24">
          <h1 className="text-3xl font-semibold text-white leading-tight tracking-tight mb-3 max-w-3xl drop-shadow-lg">
            {categoryName === 'All' ? 'All Products' : categoryName}
          </h1>
          <p className="text-base text-white/90 mb-6 max-w-2xl drop-shadow-md">
            {categoryName === 'All' 
              ? 'Browse our complete collection of premium tech products'
              : `Explore our ${categoryName.toLowerCase()} collection`
            }
          </p>
        </div>
      </div>
    </section>
  );
};