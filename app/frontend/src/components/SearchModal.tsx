import { useState, useEffect, useRef } from "react";
import { Search, X, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { promotionalProducts, bestSellers } from "@/data/products";
import type { Product } from "@/data/products";

const allProducts = [...promotionalProducts, ...bestSellers];

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    const filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleProductClick = (productId: number) => {
    onClose();
    navigate(`/produto/${productId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 mx-4 w-full max-w-2xl animate-in fade-in slide-in-from-top-4 duration-200">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#12121f] shadow-2xl shadow-indigo-500/10">
          {/* Search Input */}
          <div className="flex items-center gap-3 border-b border-white/5 px-5 py-4">
            <Search className="h-5 w-5 shrink-0 text-indigo-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="flex-1 bg-transparent text-base text-white placeholder-gray-500 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-gray-400 sm:inline-block">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.trim() === "" ? (
              <div className="px-5 py-8 text-center">
                <Search className="mx-auto mb-3 h-10 w-10 text-gray-600" />
                <p className="text-sm text-gray-400">
                  Digite o nome do produto para buscar
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Busque por smartwatches, fones, caixas de som e mais
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-gray-400">
                  Nenhum produto encontrado para "<span className="text-white">{query}</span>"
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Tente buscar com outros termos
                </p>
              </div>
            ) : (
              <div className="p-2">
                <p className="mb-2 px-3 text-xs font-medium text-gray-500">
                  {results.length} {results.length === 1 ? "resultado" : "resultados"}
                </p>
                {results.map((product) => (
                  <button
                    key={product.id}
                    className="flex w-full items-center gap-4 rounded-xl px-3 py-3 text-left transition-colors hover:bg-white/5"
                    onClick={() => handleProductClick(product.id)}
                  >
                    {/* Product thumbnail */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${product.gradient}`}>
                      <ShoppingCart className="h-5 w-5 text-white/60" />
                    </div>

                    {/* Product info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-200">
                        {product.name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="text-xs text-indigo-400">{product.category}</span>
                        {product.discount && (
                          <span className="rounded-full bg-red-500/20 px-1.5 py-0.5 text-[10px] font-bold text-red-400">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="shrink-0 text-right">
                      {product.originalPrice && (
                        <p className="text-[10px] text-gray-500 line-through">
                          R$ {formatPrice(product.originalPrice)}
                        </p>
                      )}
                      <p className="text-sm font-bold text-white">
                        R$ {formatPrice(product.currentPrice)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}