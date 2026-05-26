import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductGrid from "@/components/ProductGrid";
import PromoBanners from "@/components/PromoBanners";
import Benefits from "@/components/Benefits";
import Footer from "@/components/Footer";
import { promotionalProducts, bestSellers } from "@/data/products";

export default function Index() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Header />
      <Hero />
      <Categories />
      <ProductGrid title="PROMOÇÕES" products={promotionalProducts} id="promocoes" />
      <PromoBanners />
      <ProductGrid title="MAIS VENDIDOS" products={bestSellers} id="mais-vendidos" />
      <Benefits />
      <Footer />
    </div>
  );
}