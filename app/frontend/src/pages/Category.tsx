import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { categories, promotionalProducts, bestSellers } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const allProducts = [...promotionalProducts, ...bestSellers];

const categoryMapping: Record<string, string[]> = {
  smartwatches: ["Smartwatches"],
  massageadores: ["Massageadores"],
  fones: ["Fones de Ouvido"],
  caixas: ["Caixas de Som"],
  celular: ["Acessórios p/ Celular", "Acessórios"],
  pc: ["Acessórios p/ PC", "Acessórios PC"],
  maquinas: ["Máquinas de Cortar Cabelo", "Máquinas"],
  promocoes: ["Promoções"],
};

export default function Category() {
  const { slug } = useParams<{ slug: string }>();

  const category = categories.find(
    (c) => c.href === `#${slug}`
  );

  const categoryName = category?.name || "Categoria";

  const matchingCategories = slug ? categoryMapping[slug] || [] : [];

  let filteredProducts = allProducts.filter((p) =>
    matchingCategories.some(
      (cat) => p.category.toLowerCase() === cat.toLowerCase()
    )
  );

  // For "Promoções", show all products with discounts
  if (slug === "promocoes") {
    filteredProducts = allProducts.filter((p) => p.discount && p.discount > 0);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-32 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Início
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-sm text-white">{categoryName}</span>
        </div>

        {/* Title */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {categoryName}
          </h1>
          <p className="mt-2 text-gray-400">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/produto/${product.id}`}
                className="group overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a2e]/60 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                {/* Product Image Placeholder */}
                <div
                  className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${product.gradient}`}
                >
                  <ShoppingCart className="h-12 w-12 text-white/20" />
                  {product.discount && (
                    <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="mb-3 line-clamp-2 text-sm font-medium text-gray-200 transition-colors group-hover:text-white">
                    {product.name}
                  </h3>

                  {product.originalPrice && (
                    <p className="text-xs text-gray-500 line-through">
                      R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                    </p>
                  )}

                  <p className="text-lg font-bold text-white">
                    R$ {product.currentPrice.toFixed(2).replace(".", ",")}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    ou {product.installments}x de R${" "}
                    {product.installmentPrice.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-[#1a1a2e]/40 py-20">
            <ShoppingCart className="mb-4 h-16 w-16 text-gray-600" />
            <p className="text-lg text-gray-400">
              Nenhum produto encontrado nesta categoria
            </p>
            <Link
              to="/"
              className="mt-4 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
            >
              Ver todos os produtos
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}