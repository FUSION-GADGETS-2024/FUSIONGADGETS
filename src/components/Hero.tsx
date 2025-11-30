import { Button } from "./ui/button";

export const Hero = () => {
  return (
    <section className="relative pt-16 bg-background overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/assets/hero-bg.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-8 relative z-10">
        <div className="flex flex-col items-center justify-center text-center py-32 md:py-40">
          <h1 className="text-3xl font-semibold text-white leading-tight tracking-tight mb-4 max-w-3xl drop-shadow-lg">
            Premium Technology. Professional Quality.
          </h1>
          <p className="text-lg text-white/90 mb-8 max-w-2xl drop-shadow-md">
            Carefully curated collection of cutting-edge gadgets for professionals who demand excellence.
          </p>
          <Button className="h-10 px-6 text-sm font-medium transition-all duration-150 active:scale-[0.98] shadow-lg">
            Explore Products
          </Button>
        </div>
      </div>
    </section>
  );
};