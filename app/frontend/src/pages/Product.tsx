import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, CreditCard, Share2 } from "lucide-react";
import { promotionalProducts, bestSellers } from "@/data/products";
import type { Product as ProductType } from "@/data/products";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const allProducts = [...promotionalProducts, ...bestSellers];

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getRelatedProducts(product: ProductType): ProductType[] {
  return allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
}

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const product = allProducts.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0f]">
        <Header />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
          <h1 className="mb-4 text-2xl font-bold text-white">Produto não encontrado</h1>
          <p className="mb-6 text-gray-400">O produto que você procura não existe ou foi removido.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a loja
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link to="/" className="text-gray-400 transition-colors hover:text-white">
            Início
          </Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-400">{product.category}</span>
          <span className="text-gray-600">/</span>
          <span className="truncate text-indigo-400">{product.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="mx-auto max-w-3xl">
          {/* Category */}
          <span className="mb-3 inline-block w-fit rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
            {product.category}
          </span>

          {/* Title */}
          <h1 className="mb-6 text-2xl font-bold leading-tight text-white lg:text-3xl">
            {product.name}
          </h1>

          {/* Product Gallery - Below Title */}
          <ProductGallery productGradient={product.gradient} discount={product.discount} />

          {/* Rating */}
          <div className="mb-6 flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-400">(4.0) · 23 avaliações</span>
          </div>

          {/* Prices */}
          <div className="mb-6 rounded-xl border border-white/5 bg-[#1a1a2e]/50 p-5">
            {product.originalPrice && (
              <p className="text-sm text-gray-500 line-through">
                De: R$ {formatPrice(product.originalPrice)}
              </p>
            )}
            <p className="text-3xl font-bold text-white">
              R$ {formatPrice(product.currentPrice)}
            </p>
            <p className="mt-1 text-sm text-gray-400">
              ou <span className="font-semibold text-indigo-300">12x de R$ {formatPrice(product.installmentPrice)}</span> sem juros
            </p>
            {product.discount && (
              <p className="mt-2 text-xs text-emerald-400">
                Você economiza R$ {formatPrice(product.originalPrice! - product.currentPrice)}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                addItem(product);
                toast.success("Produto adicionado ao carrinho!");
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/40 hover:brightness-110"
            >
              <ShoppingCart className="h-5 w-5" />
              COMPRAR AGORA
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium text-gray-300 transition-all hover:border-indigo-500/30 hover:bg-white/10 hover:text-white">
              <Share2 className="h-4 w-4" />
              Compartilhar
            </button>
          </div>

          {/* Benefits */}
          <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#1a1a2e]/30 px-3 py-2.5">
              <Truck className="h-4 w-4 shrink-0 text-indigo-400" />
              <span className="text-xs text-gray-300">Entrega Rápida</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#1a1a2e]/30 px-3 py-2.5">
              <Shield className="h-4 w-4 shrink-0 text-indigo-400" />
              <span className="text-xs text-gray-300">Garantia 7 dias</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-[#1a1a2e]/30 px-3 py-2.5">
              <CreditCard className="h-4 w-4 shrink-0 text-indigo-400" />
              <span className="text-xs text-gray-300">Pagamento Seguro</span>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-white/5 bg-[#1a1a2e]/30 p-5">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Descrição</h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Produto de alta qualidade com design moderno e funcionalidades avançadas. 
              Ideal para quem busca tecnologia e praticidade no dia a dia. 
              Garantia de satisfação com suporte dedicado para qualquer dúvida.
            </p>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-8 text-2xl font-bold text-white">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  to={`/produto/${relProduct.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a2e]/50 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/5"
                >
                  {relProduct.discount && (
                    <div className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                      {relProduct.discount}% OFF
                    </div>
                  )}
                  <div className={`flex h-40 items-center justify-center bg-gradient-to-br ${relProduct.gradient}`}>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                      <ShoppingCart className="h-6 w-6 text-white/60" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <span className="mb-1 text-xs font-medium text-indigo-400">{relProduct.category}</span>
                    <h3 className="mb-2 line-clamp-2 text-sm font-medium text-gray-200 group-hover:text-white">
                      {relProduct.name}
                    </h3>
                    <div className="mt-auto">
                      <p className="text-lg font-bold text-white">
                        R$ {formatPrice(relProduct.currentPrice)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}