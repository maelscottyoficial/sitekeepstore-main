import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-[#0f0f1a] shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Carrinho</h2>
            {totalItems > 0 && (
              <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300">
                {totalItems} {totalItems === 1 ? "item" : "itens"}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            aria-label="Fechar carrinho"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingCart className="mb-4 h-16 w-16 text-gray-600" />
              <p className="text-lg font-medium text-gray-400">Carrinho vazio</p>
              <p className="mt-1 text-sm text-gray-500">
                Adicione produtos para começar suas compras
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-white/5 bg-[#1a1a2e]/50 p-3"
                >
                  {/* Product gradient thumbnail */}
                  <div
                    className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.gradient}`}
                  >
                    <ShoppingCart className="h-5 w-5 text-white/50" />
                  </div>

                  {/* Info */}
                  <div className="flex flex-1 flex-col">
                    <h3 className="line-clamp-2 text-xs font-medium text-gray-200">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-white">
                      R$ {formatPrice(item.currentPrice)}
                    </p>

                    {/* Quantity controls */}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 text-gray-400 transition-colors hover:border-indigo-500/50 hover:text-white"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-medium text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 text-gray-400 transition-colors hover:border-indigo-500/50 hover:text-white"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-gray-500 transition-colors hover:text-red-400"
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear cart button */}
              <button
                onClick={clearCart}
                className="mt-2 text-xs font-medium text-gray-500 transition-colors hover:text-red-400"
              >
                Limpar carrinho
              </button>
            </div>
          )}
        </div>

        {/* Footer with subtotal */}
        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400">Subtotal</span>
              <span className="text-xl font-bold text-white">R$ {formatPrice(totalPrice)}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
              className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </>
  );
}