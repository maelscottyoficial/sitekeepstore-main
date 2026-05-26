import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { ShoppingBag, CreditCard, QrCode, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/client";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const client = createClient();

type PaymentMethod = "pix" | "cartao";

interface FieldErrors {
  nome?: string;
  cpf?: string;
  email?: string;
  telefone?: string;
  cep?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

interface TouchedFields {
  nome?: boolean;
  cpf?: boolean;
  email?: boolean;
  telefone?: boolean;
  cep?: boolean;
  rua?: boolean;
  numero?: boolean;
  bairro?: boolean;
  cidade?: boolean;
  estado?: boolean;
  cardNumber?: boolean;
  cardName?: boolean;
  cardExpiry?: boolean;
  cardCvv?: boolean;
}

// Format helpers
function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatTelefone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length > 0 ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(" ") : "";
}

function formatCardExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

// Validation helpers
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCpfDigits(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;

  return true;
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const [touched, setTouched] = useState<TouchedFields>({});
  const [errors, setErrors] = useState<FieldErrors>({});

  const markTouched = (field: keyof TouchedFields) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation logic
  const validate = useCallback((): FieldErrors => {
    const errs: FieldErrors = {};

    if (!nome.trim()) errs.nome = "Nome é obrigatório";
    else if (nome.trim().length < 3) errs.nome = "Nome deve ter pelo menos 3 caracteres";

    const cpfDigits = cpf.replace(/\D/g, "");
    if (!cpfDigits) errs.cpf = "CPF é obrigatório";
    else if (cpfDigits.length !== 11) errs.cpf = "CPF deve ter 11 dígitos";
    else if (!validateCpfDigits(cpf)) errs.cpf = "CPF inválido";

    if (!email.trim()) errs.email = "Email é obrigatório";
    else if (!validateEmail(email)) errs.email = "Email inválido";

    const telDigits = telefone.replace(/\D/g, "");
    if (!telDigits) errs.telefone = "Telefone é obrigatório";
    else if (telDigits.length < 10) errs.telefone = "Telefone deve ter 10 ou 11 dígitos";

    const cepDigits = cep.replace(/\D/g, "");
    if (!cepDigits) errs.cep = "CEP é obrigatório";
    else if (cepDigits.length !== 8) errs.cep = "CEP deve ter 8 dígitos";

    if (!rua.trim()) errs.rua = "Rua é obrigatória";
    if (!numero.trim()) errs.numero = "Número é obrigatório";
    if (!bairro.trim()) errs.bairro = "Bairro é obrigatório";
    if (!cidade.trim()) errs.cidade = "Cidade é obrigatória";
    if (!estado.trim()) errs.estado = "Estado é obrigatório";

    if (paymentMethod === "cartao") {
      const cardDigits = cardNumber.replace(/\D/g, "");
      if (!cardDigits) errs.cardNumber = "Número do cartão é obrigatório";
      else if (cardDigits.length !== 16) errs.cardNumber = "Cartão deve ter 16 dígitos";

      if (!cardName.trim()) errs.cardName = "Nome no cartão é obrigatório";

      const expiryDigits = cardExpiry.replace(/\D/g, "");
      if (!expiryDigits) errs.cardExpiry = "Validade é obrigatória";
      else if (expiryDigits.length !== 4) errs.cardExpiry = "Formato: MM/AA";
      else {
        const month = parseInt(expiryDigits.slice(0, 2));
        if (month < 1 || month > 12) errs.cardExpiry = "Mês inválido";
      }

      const cvvDigits = cardCvv.replace(/\D/g, "");
      if (!cvvDigits) errs.cardCvv = "CVV é obrigatório";
      else if (cvvDigits.length !== 3) errs.cardCvv = "CVV deve ter 3 dígitos";
    }

    return errs;
  }, [nome, cpf, email, telefone, cep, rua, numero, bairro, cidade, estado, paymentMethod, cardNumber, cardName, cardExpiry, cardCvv]);

  useEffect(() => {
    setErrors(validate());
  }, [validate]);

  // CEP auto-lookup
  useEffect(() => {
    const cepDigits = cep.replace(/\D/g, "");
    if (cepDigits.length === 8) {
      setIsFetchingCep(true);
      fetch(`https://viacep.com.br/ws/${cepDigits}/json/`)
        .then((res) => res.json())
        .then((data) => {
          if (!data.erro) {
            setRua(data.logradouro || "");
            setBairro(data.bairro || "");
            setCidade(data.localidade || "");
            setEstado(data.uf || "");
            // Mark these as touched so validation shows green
            setTouched((prev) => ({
              ...prev,
              rua: true,
              bairro: true,
              cidade: true,
              estado: true,
            }));
          }
        })
        .catch(() => {
          // silently fail
        })
        .finally(() => {
          setIsFetchingCep(false);
        });
    }
  }, [cep]);

  // Input border class helper
  const getInputClass = (field: keyof TouchedFields) => {
    const base =
      "w-full bg-[#0a0a0f] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-colors border";
    if (touched[field] && errors[field]) {
      return `${base} border-red-500 focus:border-red-500`;
    }
    if (touched[field] && !errors[field]) {
      return `${base} border-green-500 focus:border-green-500`;
    }
    return `${base} border-white/10 focus:border-indigo-500`;
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20">
          <ShoppingBag className="w-20 h-20 text-gray-600 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-3">Seu carrinho está vazio</h2>
          <p className="text-gray-400 mb-8 text-center">
            Adicione produtos ao carrinho antes de finalizar a compra.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar à Loja
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: TouchedFields = {
      nome: true,
      cpf: true,
      email: true,
      telefone: true,
      cep: true,
      rua: true,
      numero: true,
      bairro: true,
      cidade: true,
      estado: true,
    };
    if (paymentMethod === "cartao") {
      allTouched.cardNumber = true;
      allTouched.cardName = true;
      allTouched.cardExpiry = true;
      allTouched.cardCvv = true;
    }
    setTouched(allTouched);

    const currentErrors = validate();
    if (Object.keys(currentErrors).length > 0) {
      toast.error("Corrija os campos destacados em vermelho.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is logged in
      const userResp = await client.auth.me();
      if (!userResp?.data) {
        toast.error("Faça login para finalizar seu pedido");
        await client.auth.toLogin();
        setIsSubmitting(false);
        return;
      }

      // Save order to backend
      await client.entities.orders.create({
        data: {
          customer_name: nome,
          customer_email: email,
          customer_cpf: cpf.replace(/\D/g, ""),
          customer_phone: telefone.replace(/\D/g, ""),
          address_cep: cep.replace(/\D/g, ""),
          address_street: rua,
          address_number: numero,
          address_complement: "",
          address_neighborhood: bairro,
          address_city: cidade,
          address_state: estado,
          items: JSON.stringify(
            items.map((i) => ({
              id: i.id,
              name: i.name,
              price: i.currentPrice,
              quantity: i.quantity,
              image: i.image,
            }))
          ),
          total: totalPrice,
          payment_method: paymentMethod,
          status: "confirmado",
        },
      });

      clearCart();
      toast.success("Pedido realizado com sucesso!");
      navigate("/");
    } catch {
      toast.error("Erro ao salvar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar à loja
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Finalizar Pedido</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Data */}
            <section className="bg-[#1a1a2e] rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-5">Dados Pessoais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => {
                      setNome(e.target.value);
                      if (!touched.nome) markTouched("nome");
                    }}
                    onBlur={() => markTouched("nome")}
                    className={getInputClass("nome")}
                    placeholder="Seu nome completo"
                  />
                  {touched.nome && errors.nome && (
                    <p className="text-red-400 text-xs mt-1">{errors.nome}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">CPF *</label>
                  <input
                    type="text"
                    value={cpf}
                    onChange={(e) => {
                      setCpf(formatCpf(e.target.value));
                      if (!touched.cpf) markTouched("cpf");
                    }}
                    onBlur={() => markTouched("cpf")}
                    className={getInputClass("cpf")}
                    placeholder="000.000.000-00"
                    maxLength={14}
                  />
                  {touched.cpf && errors.cpf && (
                    <p className="text-red-400 text-xs mt-1">{errors.cpf}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (!touched.email) markTouched("email");
                    }}
                    onBlur={() => markTouched("email")}
                    className={getInputClass("email")}
                    placeholder="seu@email.com"
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Telefone *</label>
                  <input
                    type="tel"
                    value={telefone}
                    onChange={(e) => {
                      setTelefone(formatTelefone(e.target.value));
                      if (!touched.telefone) markTouched("telefone");
                    }}
                    onBlur={() => markTouched("telefone")}
                    className={getInputClass("telefone")}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                  {touched.telefone && errors.telefone && (
                    <p className="text-red-400 text-xs mt-1">{errors.telefone}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Address */}
            <section className="bg-[#1a1a2e] rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-5">Endereço de Entrega</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">CEP *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => {
                        setCep(formatCep(e.target.value));
                        if (!touched.cep) markTouched("cep");
                      }}
                      onBlur={() => markTouched("cep")}
                      className={getInputClass("cep")}
                      placeholder="00000-000"
                      maxLength={9}
                    />
                    {isFetchingCep && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 animate-spin" />
                    )}
                  </div>
                  {touched.cep && errors.cep && (
                    <p className="text-red-400 text-xs mt-1">{errors.cep}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Estado *</label>
                  <input
                    type="text"
                    value={estado}
                    onChange={(e) => {
                      setEstado(e.target.value);
                      if (!touched.estado) markTouched("estado");
                    }}
                    onBlur={() => markTouched("estado")}
                    className={getInputClass("estado")}
                    placeholder="SP"
                    maxLength={2}
                  />
                  {touched.estado && errors.estado && (
                    <p className="text-red-400 text-xs mt-1">{errors.estado}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Rua *</label>
                  <input
                    type="text"
                    value={rua}
                    onChange={(e) => {
                      setRua(e.target.value);
                      if (!touched.rua) markTouched("rua");
                    }}
                    onBlur={() => markTouched("rua")}
                    className={getInputClass("rua")}
                    placeholder="Nome da rua"
                  />
                  {touched.rua && errors.rua && (
                    <p className="text-red-400 text-xs mt-1">{errors.rua}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Número *</label>
                  <input
                    type="text"
                    value={numero}
                    onChange={(e) => {
                      setNumero(e.target.value);
                      if (!touched.numero) markTouched("numero");
                    }}
                    onBlur={() => markTouched("numero")}
                    className={getInputClass("numero")}
                    placeholder="123"
                  />
                  {touched.numero && errors.numero && (
                    <p className="text-red-400 text-xs mt-1">{errors.numero}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Bairro *</label>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => {
                      setBairro(e.target.value);
                      if (!touched.bairro) markTouched("bairro");
                    }}
                    onBlur={() => markTouched("bairro")}
                    className={getInputClass("bairro")}
                    placeholder="Bairro"
                  />
                  {touched.bairro && errors.bairro && (
                    <p className="text-red-400 text-xs mt-1">{errors.bairro}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Cidade *</label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => {
                      setCidade(e.target.value);
                      if (!touched.cidade) markTouched("cidade");
                    }}
                    onBlur={() => markTouched("cidade")}
                    className={getInputClass("cidade")}
                    placeholder="Cidade"
                  />
                  {touched.cidade && errors.cidade && (
                    <p className="text-red-400 text-xs mt-1">{errors.cidade}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="bg-[#1a1a2e] rounded-xl border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-5">Forma de Pagamento</h2>
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("pix")}
                  className={`flex-1 flex items-center justify-center gap-3 px-4 py-4 rounded-xl border transition-all ${
                    paymentMethod === "pix"
                      ? "border-indigo-500 bg-indigo-500/10 text-white"
                      : "border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="font-medium">PIX</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cartao")}
                  className={`flex-1 flex items-center justify-center gap-3 px-4 py-4 rounded-xl border transition-all ${
                    paymentMethod === "cartao"
                      ? "border-indigo-500 bg-indigo-500/10 text-white"
                      : "border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="font-medium">Cartão de Crédito</span>
                </button>
              </div>

              {paymentMethod === "pix" && (
                <div className="bg-[#0a0a0f] rounded-xl border border-white/10 p-6 text-center">
                  <QrCode className="w-24 h-24 text-indigo-400 mx-auto mb-4" />
                  <p className="text-gray-300 text-sm mb-2">
                    Após confirmar o pedido, o código PIX será gerado.
                  </p>
                  <p className="text-gray-500 text-xs">
                    Chave PIX: keepstore@pagamentos.com.br
                  </p>
                </div>
              )}

              {paymentMethod === "cartao" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Número do Cartão *</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => {
                        setCardNumber(formatCardNumber(e.target.value));
                        if (!touched.cardNumber) markTouched("cardNumber");
                      }}
                      onBlur={() => markTouched("cardNumber")}
                      className={getInputClass("cardNumber")}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                    />
                    {touched.cardNumber && errors.cardNumber && (
                      <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-400 mb-1">Nome no Cartão *</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => {
                        setCardName(e.target.value);
                        if (!touched.cardName) markTouched("cardName");
                      }}
                      onBlur={() => markTouched("cardName")}
                      className={getInputClass("cardName")}
                      placeholder="Nome como está no cartão"
                    />
                    {touched.cardName && errors.cardName && (
                      <p className="text-red-400 text-xs mt-1">{errors.cardName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Validade *</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => {
                        setCardExpiry(formatCardExpiry(e.target.value));
                        if (!touched.cardExpiry) markTouched("cardExpiry");
                      }}
                      onBlur={() => markTouched("cardExpiry")}
                      className={getInputClass("cardExpiry")}
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                    {touched.cardExpiry && errors.cardExpiry && (
                      <p className="text-red-400 text-xs mt-1">{errors.cardExpiry}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">CVV *</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
                        setCardCvv(digits);
                        if (!touched.cardCvv) markTouched("cardCvv");
                      }}
                      onBlur={() => markTouched("cardCvv")}
                      className={getInputClass("cardCvv")}
                      placeholder="000"
                      maxLength={3}
                    />
                    {touched.cardCvv && errors.cardCvv && (
                      <p className="text-red-400 text-xs mt-1">{errors.cardCvv}</p>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a2e] rounded-xl border border-white/10 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-5">Resumo do Pedido</h2>
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity}x R$ {item.currentPrice.toFixed(2)}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-white whitespace-nowrap">
                      R$ {(item.currentPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Frete</span>
                  <span className="text-green-400">Grátis</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>R$ {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Finalizar Pedido
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}