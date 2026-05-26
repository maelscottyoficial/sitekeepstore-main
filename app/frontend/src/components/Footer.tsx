import { Facebook, Instagram, Mail, Phone, Clock } from "lucide-react";

const LOGO_URL = "https://mgx-backend-cdn.metadl.com/generate/images/1250664/2026-05-19/o25f63iaagqq/keepstore-logo.png";

const pageLinks = [
  { label: "Página Inicial", href: "#" },
  { label: "Produtos", href: "#categorias" },
  { label: "Promoções", href: "#promocoes" },
  { label: "Mais Vendidos", href: "#mais-vendidos" },
  { label: "Contato", href: "#contato" },
];

const otherLinks = [
  { label: "Rastreio de Pedido", href: "#" },
  { label: "Perguntas Frequentes", href: "#" },
  { label: "Reembolsos e Devoluções", href: "#" },
  { label: "Termos e Condições", href: "#" },
  { label: "Política de Privacidade", href: "#" },
];

export default function Footer() {
  return (
    <footer id="contato" className="border-t border-white/5 bg-[#060609]">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Store Info */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <img src={LOGO_URL} alt="Keep Store" className="h-9 w-9 rounded-lg" />
              <span className="text-lg font-bold text-white">
                Keep<span className="text-indigo-400">Store</span>
              </span>
            </div>
            <p className="mb-4 text-xs leading-relaxed text-gray-400">
              Inovação com preços imbatíveis. Equipamentos e acessórios eletrônicos de alta qualidade para atender às suas necessidades.
            </p>
            <div className="flex flex-col gap-2 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                Seg - Sex: 9H - 17H
              </span>
              <a href="http://wa.me/5511918723636" className="flex items-center gap-2 transition-colors hover:text-white">
                <Phone className="h-3.5 w-3.5 text-indigo-400" />
                (11) 918723636
              </a>
              <span className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-indigo-400" />
                CNPJ: 22.483.022/0001-92
              </span>
            </div>
            <div className="mt-4 flex gap-2">
              <a href="https://www.facebook.com/keepstore1/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/5 p-2 text-gray-400 transition-colors hover:bg-indigo-500/20 hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/keepstoreoficial" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white/5 p-2 text-gray-400 transition-colors hover:bg-indigo-500/20 hover:text-white">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Page Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Páginas</h3>
            <ul className="flex flex-col gap-2">
              {pageLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs text-gray-400 transition-colors hover:text-indigo-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Outros Links</h3>
            <ul className="flex flex-col gap-2">
              {otherLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-xs text-gray-400 transition-colors hover:text-indigo-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Promoções</h3>
            <p className="mb-4 text-xs text-gray-400">
              Inscreva-se e receba no seu e-mail as novidades e ofertas antecipadamente.
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Seu e-mail"
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-gray-500 outline-none transition-colors focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/25"
              />
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:brightness-110"
              >
                ENVIAR
              </button>
            </form>

            <div className="mt-6">
              <h4 className="mb-2 text-xs font-semibold text-gray-300">Formas de Pagamento:</h4>
              <div className="flex flex-wrap gap-2">
                {["PIX", "Cartão", "Boleto"].map((method) => (
                  <span key={method} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-gray-400">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/5 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © 2024 Keep Store. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}