"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";

import { supabase } from "@/lib/supabase";

interface Category { id: string; name: string; slug: string; icon: string; }
interface Product { id: string; name: string; description: string; price: number; image_url: string; categories?: { name: string; icon: string; slug: string }; }

export default function MenuPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("products").select("*, categories(name, icon, slug)")
    ]).then(([catRes, prodRes]) => {
      setCategories(catRes.data || []);
      setProducts(prodRes.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;
    setLoading(true);
    
    const fetchFiltered = async () => {
      let query = supabase.from("products").select("*, categories(name, icon, slug)");
      if (activeCategory !== "all") {
        const { data: cat } = await supabase.from("categories").select("id").eq("slug", activeCategory).single();
        if (cat) query = query.eq("category_id", cat.id);
      }
      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    };
    
    fetchFiltered();
  }, [activeCategory]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-oreo-white">
      <Navbar />

      {/* Page header — black bg */}
      <section className="bg-oreo-black pt-28 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lumer-light text-xs font-bold tracking-widest uppercase mb-3">🍪 Semua Menu</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-oreo-white mb-4">
            Menu <span className="italic text-oreo-cream">Dessert</span>
          </h1>
          <p className="text-oreo-white/50 max-w-md mx-auto">
            Pilih favoritmu dan langsung pesan — semua dibuat fresh setiap hari!
          </p>
        </div>
      </section>

      {/* Filters — white sticky bar */}
      <section className="sticky top-0 z-30 bg-oreo-white border-b border-oreo-light shadow-oreo py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-oreo-black/30" />
            <input
              type="text"
              placeholder="Cari dessert..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 py-2.5 text-sm"
              id="menu-search"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto flex-nowrap pb-0.5">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                activeCategory === "all"
                  ? "bg-oreo-black text-oreo-white shadow-oreo"
                  : "border border-oreo-light text-oreo-black/60 hover:border-oreo-black hover:text-oreo-black"
              }`}
              id="category-all"
            >
              🍰 Semua
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat.slug
                    ? "bg-oreo-black text-oreo-white shadow-oreo"
                    : "border border-oreo-light text-oreo-black/60 hover:border-oreo-black hover:text-oreo-black"
                }`}
                id={`category-${cat.slug}`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-oreo-cream rounded-2xl h-72 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-28">
              <span className="text-7xl mb-5 block">🍪</span>
              <p className="text-oreo-black/40 text-lg">
                {search ? `Tidak ada hasil untuk "${search}"` : "Belum ada produk di kategori ini"}
              </p>
            </div>
          ) : (
            <>
              <p className="text-oreo-black/30 text-sm mb-6">{filtered.length} produk ditemukan</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
