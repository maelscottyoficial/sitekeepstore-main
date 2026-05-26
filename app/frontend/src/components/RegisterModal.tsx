import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { createClient } from "@/lib/client";

const client = createClient();

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits.length > 0 ? `(${digits}` : "";
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatPhone(e.target.value));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!email.trim()) {
      newErrors.email = "E-mail é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Formato de e-mail inválido";
    }
    if (!telefone.trim()) newErrors.telefone = "Telefone é obrigatório";
    if (!senha) {
      newErrors.senha = "Senha é obrigatória";
    } else if (senha.length < 6) {
      newErrors.senha = "Senha deve ter no mínimo 6 caracteres";
    }
    if (!confirmSenha) {
      newErrors.confirmSenha = "Confirmação de senha é obrigatória";
    } else if (senha !== confirmSenha) {
      newErrors.confirmSenha = "As senhas não coincidem";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    onClose();
    await client.auth.toLogin();
  };

  const resetForm = () => {
    setNome("");
    setEmail("");
    setTelefone("");
    setSenha("");
    setConfirmSenha("");
    setErrors({});
    setSubmitted(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-[#1a1a2e] border-white/10 p-0 sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 pb-0">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-white text-center">
              Criar sua conta
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              Junte-se à{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                KeepStore
              </span>
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {/* Nome Completo */}
          <div className="space-y-1.5">
            <label htmlFor="register-nome" className="text-sm font-medium text-gray-300">
              Nome completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="register-nome"
                type="text"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {submitted && errors.nome && (
              <p className="text-xs text-red-400">{errors.nome}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="register-email" className="text-sm font-medium text-gray-300">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="register-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {submitted && errors.email && (
              <p className="text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Telefone */}
          <div className="space-y-1.5">
            <label htmlFor="register-telefone" className="text-sm font-medium text-gray-300">
              Telefone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="register-telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={handlePhoneChange}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            {submitted && errors.telefone && (
              <p className="text-xs text-red-400">{errors.telefone}</p>
            )}
          </div>

          {/* Senha */}
          <div className="space-y-1.5">
            <label htmlFor="register-senha" className="text-sm font-medium text-gray-300">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="register-senha"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 6 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {submitted && errors.senha && (
              <p className="text-xs text-red-400">{errors.senha}</p>
            )}
          </div>

          {/* Confirmar Senha */}
          <div className="space-y-1.5">
            <label htmlFor="register-confirm-senha" className="text-sm font-medium text-gray-300">
              Confirmar senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                id="register-confirm-senha"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repita sua senha"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#0a0a0f] py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {submitted && errors.confirmSenha && (
              <p className="text-xs text-red-400">{errors.confirmSenha}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-600 hover:to-purple-600 hover:shadow-indigo-500/40"
          >
            Criar conta
          </button>

          {/* Switch to Login */}
          <p className="text-center text-sm text-gray-400">
            Já tem conta?{" "}
            <button
              type="button"
              onClick={() => {
                resetForm();
                onSwitchToLogin();
              }}
              className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Entrar
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}