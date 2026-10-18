"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero, { OfferTicker } from "@/components/sections/Hero";
import Categories from "@/components/sections/Features";
import Products from "@/components/sections/Products";
import useStore from "@/hooks/useStore";

export default function Home() {
  const { products, settings, rates, loading, error } = useStore();
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero products={products} settings={settings} />
        <OfferTicker settings={settings} />
        <Categories products={products} />
        <Products products={products} settings={settings} rates={rates} loading={loading} error={error} />
      </main>
      <Footer />
    </>
  );
}
