import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/client";
import { Loader2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AdminLayout from "@/components/AdminLayout";

const client = createClient();

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderEntity {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  items: string;
  total: number;
  status: string;
  payment_method: string;
  address?: string;
}

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "processando", label: "Processando" },
  { value: "enviado", label: "Enviado" },
  { value: "entregue", label: "Entregue" },
  { value: "cancelado", label: "Cancelado" },
];

const statusColors: Record<string, string> = {
  pendente: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  processando: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  enviado: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  entregue: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelado: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailOrder, setDetailOrder] = useState<OrderEntity | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const resp = await client.entities.orders.queryAll({
        query: {},
        sort: "-created_at",
        limit: 100,
      });
      if (resp?.data?.items) {
        setOrders(resp.data.items as OrderEntity[]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await client.entities.orders.update({
        id: orderId,
        data: { status: newStatus },
      });
      await fetchOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const parseItems = (itemsStr: string): OrderItem[] => {
    try {
      return JSON.parse(itemsStr);
    } catch {
      return [];
    }
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

  const getPaymentLabel = (method: string) => {
    if (method === "pix") return "PIX";
    if (method === "cartao") return "Cartão";
    return method;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Pedidos</h1>
          <p className="text-gray-400 text-sm mt-1">
            Visualize e gerencie todos os pedidos da loja
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="bg-[#1a1a2e] rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Pagamento
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{order.customer_name}</div>
                        {order.customer_email && (
                          <div className="text-xs text-gray-500">{order.customer_email}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        R$ {order.total?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {getPaymentLabel(order.payment_method)}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border cursor-pointer ${
                            statusColors[order.status] || statusColors.pendente
                          } bg-transparent`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#1a1a2e] text-white">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDetailOrder(order)}
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!detailOrder} onOpenChange={() => setDetailOrder(null)}>
        <DialogContent className="bg-[#1a1a2e] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center justify-between">
              Detalhes do Pedido
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDetailOrder(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Cliente</p>
                  <p className="text-sm text-white">{detailOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Data</p>
                  <p className="text-sm text-white">{formatDate(detailOrder.created_at)}</p>
                </div>
                {detailOrder.customer_email && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Email</p>
                    <p className="text-sm text-white">{detailOrder.customer_email}</p>
                  </div>
                )}
                {detailOrder.customer_phone && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Telefone</p>
                    <p className="text-sm text-white">{detailOrder.customer_phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500 uppercase">Pagamento</p>
                  <p className="text-sm text-white">{getPaymentLabel(detailOrder.payment_method)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Status</p>
                  <Badge
                    variant="secondary"
                    className={statusColors[detailOrder.status] || statusColors.pendente}
                  >
                    {statusOptions.find((s) => s.value === detailOrder.status)?.label || detailOrder.status}
                  </Badge>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-gray-500 uppercase mb-3">Itens do Pedido</p>
                <div className="space-y-2">
                  {parseItems(detailOrder.items).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-[#0a0a0f] rounded-lg px-4 py-3"
                    >
                      <div className="flex-1">
                        <p className="text-sm text-white truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">Qtd: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-white ml-4">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                <span className="text-gray-400 font-medium">Total</span>
                <span className="text-xl font-bold text-white">
                  R$ {detailOrder.total?.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}