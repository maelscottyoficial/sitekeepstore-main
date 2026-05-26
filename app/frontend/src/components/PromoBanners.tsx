const HEADPHONES_IMAGE = "https://mgx-backend-cdn.metadl.com/generate/images/1250664/2026-05-19/o25gdliaagpa/promo-headphones-banner.png";
const SPEAKERS_IMAGE = "https://mgx-backend-cdn.metadl.com/generate/images/1250664/2026-05-19/o25gbraaagnq/promo-speakers-banner.png";

export default function PromoBanners() {
  return (
    <section className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          {/* Headphones Banner */}
          <a
            href="#fones"
            className="group relative overflow-hidden rounded-2xl"
          >
            <img
              src={HEADPHONES_IMAGE}
              alt="Promoção Fones"
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="mb-2 inline-block rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white">
                PROMOÇÃO
              </span>
              <h3 className="text-xl font-bold text-white md:text-2xl">
                FONES COM ATÉ 50% DE DESCONTO
              </h3>
              <span className="mt-2 inline-block text-sm font-medium text-indigo-300 transition-colors group-hover:text-indigo-200">
                ACESSAR →
              </span>
            </div>
          </a>

          {/* Speakers Banner */}
          <a
            href="#caixas"
            className="group relative overflow-hidden rounded-2xl"
          >
            <img
              src={SPEAKERS_IMAGE}
              alt="Promoção Caixas de Som"
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="mb-2 inline-block rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white">
                PROMOÇÃO
              </span>
              <h3 className="text-xl font-bold text-white md:text-2xl">
                CAIXINHAS DE SOM COM ATÉ 30% OFF
              </h3>
              <span className="mt-2 inline-block text-sm font-medium text-indigo-300 transition-colors group-hover:text-indigo-200">
                ACESSAR →
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}