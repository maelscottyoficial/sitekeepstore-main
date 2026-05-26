import { ShoppingCart, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductGridProps {
  title: string;
  products: Product[];
  id?: string;
}

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function ProductGrid({ title, products, id }: ProductGridProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success("Produto adicionado ao carrinho!");
  };
  return (
    <section id={id} className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">{title}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/produto/${product.id}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-[#1a1a2e]/50 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute left-3 top-3 z-10 rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                  {product.discount}% OFF
                </div>
              )}

              {/* Product Image Placeholder */}
              <div className={`flex h-48 items-center justify-center bg-gradient-to-br ${product.gradient} p-6`}>
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                  <ShoppingCart className="h-8 w-8 text-white/60" />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-1 flex-col p-4">
                <span className="mb-1 text-xs font-medium text-indigo-400">
                  {product.category}
                </span>
                <h3 className="mb-3 line-clamp-2 text-sm font-medium leading-snug text-gray-200 transition-colors group-hover:text-white">
                  {product.name}
                </h3>

                <div className="mt-auto">
                  {/* Prices */}
                  {product.originalPrice && (
                    <p className="text-xs text-gray-500 line-through">
                      R$ {formatPrice(product.originalPrice)}
                    </p>
                  )}
                  <p className="text-lg font-bold text-white">
                    R$ {formatPrice(product.currentPrice)}
                  </p>
                  <p className="mb-3 text-xs text-gray-400">
                    12x de <span className="text-indigo-300">R$ {formatPrice(product.installmentPrice)}</span>
                  </p>

                  {/* Buy Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:shadow-lg hover:shadow-indigo-500/25 hover:brightness-110"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    COMPRAR
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}