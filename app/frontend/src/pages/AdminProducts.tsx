import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/client";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import AdminLayout from "@/components/AdminLayout";

const client = createClient();

interface ProductEntity {
  id: string;
  name: string;
  category: string;
  current_price: number;
  original_price?: number;
  discount?: number;
  installments?: number;
  installment_price?: number;
  active?: boolean;
  created_at?: string;
}

interface ProductForm {
  name: string;
  category: string;
  current_price: string;
  original_price: string;
  discount: string;
  installments: string;
  installment_price: string;
  active: string;
}

const emptyForm: ProductForm = {
  name: "",
  category: "",
  current_price: "",
  original_price: "",
  discount: "",
  installments: "12",
  installment_price: "",
  active: "true",
};

export default function AdminProducts() {
  const [products, setProducts] = useState<ProductEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductEntity | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProductEntity | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const resp = await client.entities.products.query({
        query: {},
        sort: "-created_at",
        limit: 100,
      });
      if (resp?.data?.items) {
        setProducts(resp.data.items as ProductEntity[]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openCreateDialog = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEditDialog = (product: ProductEntity) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      category: product.category || "",
      current_price: String(product.current_price || ""),
      original_price: String(product.original_price || ""),
      discount: String(product.discount || ""),
      installments: String(product.installments || "12"),
      installment_price: String(product.installment_price || ""),
      active: product.active === false ? "false" : "true",
    });
    setDialogOpen(true);
  };

  const openDeleteDialog = (product: ProductEntity) => {
    setDeletingProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category,
        current_price: parseFloat(form.current_price) || 0,
        original_price: form.original_price ? parseFloat(form.original_price) : undefined,
        discount: form.discount ? parseInt(form.discount) : undefined,
        installments: form.installments ? parseInt(form.installments) : 12,
        installment_price: form.installment_price ? parseFloat(form.installment_price) : undefined,
        active: form.active === "true",
      };

      if (editingProduct) {
        await client.entities.products.update({
          id: editingProduct.id,
          data: payload,
        });
      } else {
        await client.entities.products.create({
          data: payload,
        });
      }

      setDialogOpen(false);
      await fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await client.entities.products.delete({ id: deletingProduct.id });
      setDeleteDialogOpen(false);
      setDeletingProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const toggleStatus = async (product: ProductEntity) => {
    const newActive = product.active === false ? true : false;
    try {
      await client.entities.products.update({
        id: product.id,
        data: { active: newActive },
      });
      await fetchProducts();
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Produtos</h1>
            <p className="text-gray-400 text-sm mt-1">
              Gerencie o catálogo de produtos da loja
            </p>
          </div>
          <Button
            onClick={openCreateDialog}
            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Nenhum produto cadastrado</p>
            <p className="text-gray-500 text-sm mt-2">
              Clique em &quot;Novo Produto&quot; para adicionar o primeiro produto.
            </p>
          </div>
        ) : (
          <div className="bg-[#1a1a2e] rounded-xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Preço
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Desconto
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
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-white max-w-[250px] truncate">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        R$ {product.current_price?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {product.discount ? (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                            -{product.discount}%
                          </Badge>
                        ) : (
                          <span className="text-gray-500">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => toggleStatus(product)}>
                          <Badge
                            variant="secondary"
                            className={
                              product.active !== false
                                ? "bg-green-500/20 text-green-400 border-green-500/30 cursor-pointer"
                                : "bg-red-500/20 text-red-400 border-red-500/30 cursor-pointer"
                            }
                          >
                            {product.active !== false ? "Ativo" : "Inativo"}
                          </Badge>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(product)}
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(product)}
                            className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-[#1a1a2e] border-white/10 text-white max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingProduct ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nome</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-[#0a0a0f] border-white/10 text-white"
                placeholder="Nome do produto"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Categoria</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="bg-[#0a0a0f] border-white/10 text-white"
                placeholder="Ex: Smartwatches, Fones de Ouvido"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Preço Atual (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.current_price}
                  onChange={(e) => setForm({ ...form, current_price: e.target.value })}
                  className="bg-[#0a0a0f] border-white/10 text-white"
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Preço Original (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.original_price}
                  onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                  className="bg-[#0a0a0f] border-white/10 text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Desconto (%)</Label>
                <Input
                  type="number"
                  value={form.discount}
                  onChange={(e) => setForm({ ...form, discount: e.target.value })}
                  className="bg-[#0a0a0f] border-white/10 text-white"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Parcelas</Label>
                <Input
                  type="number"
                  value={form.installments}
                  onChange={(e) => setForm({ ...form, installments: e.target.value })}
                  className="bg-[#0a0a0f] border-white/10 text-white"
                  placeholder="12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Valor Parcela</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.installment_price}
                  onChange={(e) => setForm({ ...form, installment_price: e.target.value })}
                  className="bg-[#0a0a0f] border-white/10 text-white"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Status</Label>
              <select
                value={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.value })}
                className="w-full rounded-md bg-[#0a0a0f] border border-white/10 text-white px-3 py-2 text-sm"
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setDialogOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.name || !form.current_price}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {editingProduct ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1a1a2e] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Excluir Produto</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir &quot;{deletingProduct?.name}&quot;? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-gray-300 hover:bg-white/5 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}