import { useState } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";

interface GalleryImage {
  id: number;
  gradient: string;
  label: string;
}

interface ProductGalleryProps {
  productGradient: string;
  discount?: number;
}

function generateGalleryImages(baseGradient: string): GalleryImage[] {
  const gradients = [
    baseGradient,
    "from-purple-900/80 to-indigo-900/80",
    "from-slate-800/80 to-zinc-900/80",
    "from-indigo-800/80 to-blue-900/80",
  ];
  const labels = ["Principal", "Lateral", "Detalhe", "Embalagem"];
  return gradients.map((gradient, index) => ({
    id: index,
    gradient,
    label: labels[index],
  }));
}

export default function ProductGallery({ productGradient, discount }: ProductGalleryProps) {
  const images = generateGalleryImages(productGradient);
  const [activeIndex, setActiveIndex] = useState(0);

  const goToPrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="mb-8">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5">
        {discount && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg">
            {discount}% OFF
          </div>
        )}

        {/* Arrow Navigation */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-black/70"
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-black/70"
          aria-label="Próxima imagem"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Image Display */}
        <div className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${images[activeIndex].gradient} transition-all duration-300`}>
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">
            <ShoppingCart className="h-16 w-16 text-white/50" />
          </div>
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-3 flex gap-2">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setActiveIndex(index)}
            className={`relative flex-1 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
              index === activeIndex
                ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                : "border-white/5 hover:border-white/20"
            }`}
            aria-label={`Ver imagem: ${image.label}`}
          >
            <div className={`flex aspect-square items-center justify-center bg-gradient-to-br ${image.gradient}`}>
              <ShoppingCart className="h-4 w-4 text-white/40" />
            </div>
            {index === activeIndex && (
              <div className="absolute inset-0 rounded-lg ring-2 ring-indigo-500 ring-offset-1 ring-offset-[#0a0a0f]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}