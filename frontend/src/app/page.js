"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Products from "@/components/sections/Products";
import useProducts from "@/hooks/useProducts";

export default function Home() {
  const { products, loading, error } = useProducts();
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero products={products} />
        <Products products={products} loading={loading} error={error} />
      </main>
      <Footer />
    </>
  );
}
