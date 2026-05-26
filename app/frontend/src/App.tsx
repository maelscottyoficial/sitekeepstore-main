import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import BlogRoutes from './blog-routes';
import Index from './pages/Index';
import Product from './pages/Product';
import Category from './pages/Category';
import Checkout from './pages/Checkout';
import MeusPedidos from './pages/MeusPedidos';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminSettings from './pages/AdminSettings';
import AuthCallback from './pages/AuthCallback';
import AuthError from './pages/AuthError';
import PageTransition from './components/PageTransition';
import { CartProvider } from './context/CartContext';
// MODULE_IMPORTS_START
// MODULE_IMPORTS_END

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const AppRoutes = () => (
  <PageTransition>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/produto/:id" element={<Product />} />
      <Route path="/categoria/:slug" element={<Category />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/meus-pedidos" element={<MeusPedidos />} />
      <Route path="/admin/produtos" element={<AdminProducts />} />
      <Route path="/admin/pedidos" element={<AdminOrders />} />
      <Route path="/admin/configuracoes" element={<AdminSettings />} />
      {/* <Route path="/blog/*" element={<BlogRoutes />} /> */}
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/error" element={<AuthError />} />
      {/* MODULE_ROUTES_START */}
      {/* MODULE_ROUTES_END */}
    </Routes>
  </PageTransition>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      {/* MODULE_PROVIDERS_START */}
      {/* MODULE_PROVIDERS_END */}
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
      {/* MODULE_PROVIDERS_CLOSE */}
    </CartProvider>
  </QueryClientProvider>
);

export default App;
export { AppRoutes };
