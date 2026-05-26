import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createClient } from "@/lib/client";
import { Package, ArrowLeft, LogIn, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const client = createClient();

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  items: string;
  total: number;
  status: string;
  payment_method: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  confirmado: { label: "Confirmado", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  enviado: { label: "Enviado", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  entregue: { label: "Entregue", color: "bg-green-500/20 text-green-400 border-green-500/30" },
};

export default function MeusPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuthAndFetch() {
      try {
        const userResp = await client.auth.me();
        if (userResp?.data) {
          setIsAuthenticated(true);
          const response = await client.entities.orders.query({
            query: {},
            sort: "-created_at",
            limit: 50,
          });
          if (response?.data?.items) {
            setOrders(response.data.items as Order[]);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    checkAuthAndFetch();
  }, []);

  const handleLogin = async () => {
    await client.auth.toLogin();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const parseItems = (itemsStr: string): OrderItem[] => {
    try {
      return JSON.parse(itemsStr);
    } catch {
      return [];
    }
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || statusConfig.pendente;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentLabel = (method: string) => {
    if (method === "pix") return "PIX";
    if (method === "cartao") return "Cartão de Crédito";
    return method;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          <LogIn className="w-16 h-16 text-gray-600 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">Faça login para ver seus pedidos</h2>
          <p className="text-gray-400 mb-8 text-center max-w-md">
            Você precisa estar logado para acessar o histórico de pedidos.
          </p>
          <button
            onClick={handleLogin}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <LogIn className="w-5 h-5" />
            Entrar na conta
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à loja
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Meus Pedidos</h1>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="w-16 h-16 text-gray-600 mb-6" />
            <h2 className="text-xl font-semibold text-white mb-3">Nenhum pedido encontrado</h2>
            <p className="text-gray-400 mb-8 text-center">
              Você ainda não realizou nenhum pedido.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderItems = parseItems(order.items);
              const itemsSummary = orderItems
                .map((i) => `${i.quantity}x ${i.name}`)
                .join(", ");

              return (
                <div
                  key={order.id}
                  className="bg-[#1a1a2e] rounded-xl border border-white/10 p-6 transition-colors hover:border-white/20"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                      <span className="text-sm text-gray-400">
                        {formatDate(order.created_at)}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <span className="text-sm text-gray-400">
                      {getPaymentLabel(order.payment_method)}
                    </span>
                  </div>

                  <p className="text-white text-sm mb-3 line-clamp-2">{itemsSummary}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-sm text-gray-400">
                      {orderItems.length} {orderItems.length === 1 ? "item" : "itens"}
                    </span>
                    <span className="text-lg font-bold text-white">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}