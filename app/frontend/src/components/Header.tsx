import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, Facebook, Instagram, User, LogOut, Package } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/client";
import SearchModal from "@/components/SearchModal";
import CartDrawer from "@/components/CartDrawer";
import LoginModal from "@/components/LoginModal";
import RegisterModal from "@/components/RegisterModal";
import { useCart } from "@/context/CartContext";

const client = createClient();

const LOGO_URL = "https://mgx-backend-cdn.metadl.com/generate/images/1250664/2026-05-19/o25f63iaagqq/keepstore-logo.png";

const navLinks = [
  { label: "Página Inicial", href: "#" },
  { label: "Categorias", href: "#categorias" },
  { label: "Promoções", href: "#promocoes" },
  { label: "Mais Vendidos", href: "#mais-vendidos" },
  { label: "Contato", href: "#contato" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const resp = await client.auth.me();
        setIsLoggedIn(!!resp?.data);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async () => {
    await client.auth.toLogin();
  };

  const handleLogout = async () => {
    await client.auth.logout();
    setIsLoggedIn(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={LOGO_URL} alt="Keep Store" className="h-10 w-10 rounded-lg" />
            <span className="text-xl font-bold text-white">
              Keep<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Store</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <a href="https://www.facebook.com/keepstore1/" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/keepstoreoficial" target="_blank" rel="noopener noreferrer" className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Buscar produtos"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Abrir carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>
            {!isLoggedIn ? (
              <button
                onClick={() => setLoginOpen(true)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Entrar"
              >
                <User className="h-5 w-5" />
              </button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative rounded-full p-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                    aria-label="Menu do usuário"
                  >
                    <User className="h-5 w-5" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-green-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1a1a2e] border-white/10">
                  <DropdownMenuItem
                    onClick={() => navigate("/meus-pedidos")}
                    className="cursor-pointer text-gray-200 focus:bg-white/10 focus:text-white"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Meus Pedidos
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate("/admin/produtos")}
                    className="cursor-pointer text-gray-200 focus:bg-white/10 focus:text-white"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Painel Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-gray-200 focus:bg-white/10 focus:text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <button
              className="rounded-full p-2 text-gray-400 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl md:hidden">
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Login Modal */}
      <LoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={() => { setLoginOpen(false); setRegisterOpen(true); }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={() => { setRegisterOpen(false); setLoginOpen(true); }}
      />
    </>
  );
}