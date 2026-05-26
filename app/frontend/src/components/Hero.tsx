import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  badge: string;
  title: string;
  highlight: string;
  description: string;
  link: string;
}

const slides: Slide[] = [
  {
    image: "https://mgx-backend-cdn.metadl.com/generate/images/1250664/2026-05-19/o25gciqaagoq/hero-smartwatch-banner.png",
    badge: "Lançamento",
    title: "Smart",
    highlight: "Watch",
    description: "Lançamentos com sistema de rastreamento de passos, batimento cardíaco, emparelhamento com seu celular, WhatsApp, notificações e muito mais.",
    link: "/categoria/smartwatches",
  },
  {
    image: "https://mgx-backend-cdn.metadl.com/generate/images/1250664/2026-05-21/o7mstvaaagta/hero-headphones-banner.png",
    badge: "Oferta Especial",
    title: "Fones de",
    highlight: " Ouvido",
    description: "Os melhores fones bluetooth com cancelamento de ruído, graves potentes e bateria de longa duração para o seu dia a dia.",
    link: "/categoria/fones",
  },
  {
    image: "https://mgx-backend-cdn.metadl.com/generate/images/1250664/2026-05-21/o7msshaaagsq/hero-speakers-banner.png",
    badge: "Mais Vendidos",
    title: "Caixas de",
    highlight: " Som",
    description: "Caixas de som bluetooth portáteis com qualidade de áudio profissional, LED e resistência à água para festas e aventuras.",
    link: "/categoria/caixas",
  },
  {
    image: "https://mgx-backend-cdn.metadl.com/generate/images/1250664/2026-05-21/o7msvmiaagra/hero-clippers-banner.png",
    badge: "Novidades",
    title: "Máquinas de",
    highlight: " Cortar",
    description: "Máquinas profissionais sem fio com lâminas de alta precisão, design ergonômico e bateria de longa duração para cortes perfeitos.",
    link: "/categoria/maquinas",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((current + 1) % slides.length);
  }, [current, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((current - 1 + slides.length) % slides.length);
  }, [current, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[current];

  return (
    <section className="relative flex min-h-[500px] items-center overflow-hidden lg:min-h-[600px]">
      {/* Background Image */}
      <div className="absolute inset-0">
        {slide.image ? (
          <img
            key={current}
            src={slide.image}
            alt={`${slide.title} ${slide.highlight} Banner`}
            className="h-full w-full object-cover animate-fade-in"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 animate-fade-in" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-20 lg:px-8">
        <div key={current} className="max-w-xl animate-slide-up">
          <span className="mb-4 inline-block rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-300">
            {slide.badge}
          </span>
          <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
            {slide.title}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {slide.highlight}
            </span>
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-gray-300">
            {slide.description}
          </p>
          <a
            href={slide.link}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:brightness-110"
          >
            ACESSAR
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white/70 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-black/60 hover:text-white"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 p-2 text-white/70 backdrop-blur-sm transition-all hover:border-white/30 hover:bg-black/60 hover:text-white"
        aria-label="Próximo slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current
                ? "w-8 bg-indigo-400"
                : "w-2 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Ir para slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}