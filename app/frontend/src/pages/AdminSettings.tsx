import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, Save, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import AdminLayout from "@/components/AdminLayout";
import { settingsApi } from "@/api/settings";

export default function AdminSettings() {
  const [accessToken, setAccessToken] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [showPublicKey, setShowPublicKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const config = await settingsApi.getConfig();
        if (config?.backend_vars) {
          const vars = config.backend_vars;
          if (vars.MERCADO_PAGO_ACCESS_TOKEN) {
            setAccessToken(vars.MERCADO_PAGO_ACCESS_TOKEN.value || "");
          }
          if (vars.MERCADO_PAGO_PUBLIC_KEY) {
            setPublicKey(vars.MERCADO_PAGO_PUBLIC_KEY.value || "");
          }
        }
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("Erro ao carregar configurações");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (accessToken) {
        await settingsApi.updateBackendConfig("MERCADO_PAGO_ACCESS_TOKEN", accessToken);
      }
      if (publicKey) {
        await settingsApi.updateBackendConfig("MERCADO_PAGO_PUBLIC_KEY", publicKey);
      }

      toast.success("Configurações salvas com sucesso!");
    } catch (err) {
      console.error("Error saving settings:", err);
      toast.error("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };



  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Configurações</h1>
          <p className="text-gray-400 text-sm mt-1">
            Gerencie as integrações e chaves de API da loja
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          </div>
        ) : (
          <div className="bg-[#1a1a2e] rounded-xl border border-white/10 p-6 space-y-6">
            {/* Mercado Pago Section */}
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-indigo-600/20 border border-indigo-500/30">
                <CreditCard className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-white">
                  Mercado Pago
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Configure as chaves de API do Mercado Pago para processar
                  pagamentos na loja. Obtenha suas credenciais em{" "}
                  <a
                    href="https://www.mercadopago.com.br/developers/panel/app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 underline"
                  >
                    mercadopago.com.br/developers
                  </a>
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 space-y-5">
              {/* Access Token */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">
                  Access Token
                </Label>
                <p className="text-gray-500 text-xs">
                  Chave secreta para autenticação no servidor (nunca exponha no
                  frontend)
                </p>
                <div className="relative">
                  <Input
                    type={showAccessToken ? "text" : "password"}
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    className="bg-[#0a0a0f] border-white/10 text-white pr-12 font-mono text-sm"
                    placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccessToken(!showAccessToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showAccessToken ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Public Key */}
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm font-medium">
                  Public Key
                </Label>
                <p className="text-gray-500 text-xs">
                  Chave pública para integração no checkout (pode ser usada no
                  frontend)
                </p>
                <div className="relative">
                  <Input
                    type={showPublicKey ? "text" : "password"}
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    className="bg-[#0a0a0f] border-white/10 text-white pr-12 font-mono text-sm"
                    placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPublicKey(!showPublicKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPublicKey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="border-t border-white/10 pt-6 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Configurações
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}