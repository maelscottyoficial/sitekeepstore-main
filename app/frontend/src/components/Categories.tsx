import { Watch, Heart, Headphones, Speaker, Smartphone, Monitor, Scissors, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { categories } from "@/data/products";

const iconMap: Record<string, React.ElementType> = {
  Watch,
  Heart,
  Headphones,
  Speaker,
  Smartphone,
  Monitor,
  Scissors,
  Tag,
};

export default function Categories() {
  return (
    <section id="categorias" className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            CATEGORIAS
          </h2>
          <p className="mt-3 text-gray-400">
            Encontre o que você precisa nas nossas categorias
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon];
            const slug = cat.href.replace("#", "");
            return (
              <Link
                key={cat.id}
                to={`/categoria/${slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-[#1a1a2e]/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-[#1a1a2e] hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 transition-all group-hover:from-indigo-500/30 group-hover:to-purple-500/30">
                  {Icon && <Icon className="h-7 w-7 text-indigo-400 transition-colors group-hover:text-indigo-300" />}
                </div>
                <span className="text-center text-sm font-medium text-gray-300 transition-colors group-hover:text-white">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}