"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Share2 } from "lucide-react";
import { useCart } from "@/lib/cartStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { items } = useCart();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // Detect if we're on the hero (dark) section or white section
  const [heroBg, setHeroBg] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      // After hero section (~100vh), switch to dark links
      setHeroBg(window.scrollY < window.innerHeight * 0.7);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On non-home pages, always show dark navbar
  const isHome = pathname === "/";
  const showDark = !isHome || scrolled || !heroBg;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled || !isHome
            ? "glassmorphism-light shadow-oreo py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between relative">

            {/* Left nav links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className={showDark ? "nav-link" : "nav-link-white"}>
                Beranda
              </Link>
              <Link href="/menu" className={`${showDark ? "nav-link" : "nav-link-white"} ${pathname === "/menu" ? "font-semibold" : ""}`}>
                Menu
              </Link>
              <Link href="/order-history" className={`${showDark ? "nav-link" : "nav-link-white"} ${pathname === "/order-history" ? "font-semibold" : ""}`}>
                Pesanan
              </Link>
              <Link href="/#comments" className={showDark ? "nav-link" : "nav-link-white"}>
                Live Chat
              </Link>
              <Link href="/share" className={`${showDark ? "nav-link" : "nav-link-white"} flex items-center gap-1 ${pathname === "/share" ? "font-semibold" : ""}`}>
                <Share2 size={13} /> Share
              </Link>
              <Link href="/admin/login" className={`${showDark ? "nav-link" : "nav-link-white"} opacity-40 hover:opacity-100 transition-opacity`}>
                Admin
              </Link>
            </div>

            {/* Center logo — absolutely centered */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group"
            >
              {/* Oreo cookie SVG logo */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${showDark ? "bg-oreo-black" : "bg-oreo-white"}`}>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${showDark ? "border-oreo-white" : "border-oreo-black"}`}>
                  <div className={`w-2 h-2 rounded-full ${showDark ? "bg-oreo-white" : "bg-oreo-black"}`} />
                </div>
              </div>
              <span className={`font-display text-xl font-bold tracking-wide transition-colors duration-300 ${showDark ? "text-oreo-black" : "text-oreo-white"}`}>
                Sweet<span className={showDark ? "text-lumer" : "text-caramel"}>Melt</span>
              </span>
            </Link>

            {/* Right items */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#about" className={showDark ? "nav-link" : "nav-link-white"}>
                Tentang Kami
              </Link>
              <Link
                href="/cart"
                className={`relative flex items-center gap-1.5 font-semibold text-sm px-4 py-2 rounded-full transition-all duration-300 ${
                  showDark
                    ? "bg-oreo-black text-oreo-white hover:bg-oreo-gray"
                    : "bg-oreo-white text-oreo-black hover:bg-oreo-cream"
                }`}
                id="cart-button"
              >
                <ShoppingCart size={15} />
                <span>Keranjang</span>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-lumer text-oreo-white w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              className={`md:hidden ml-auto transition-colors ${showDark ? "text-oreo-black hover:text-lumer" : "text-oreo-white hover:text-oreo-cream"}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              id="mobile-menu-toggle"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden glassmorphism-light mt-2 mx-4 rounded-2xl p-5 animate-fade-in border border-oreo-light shadow-oreo-lg">
            <div className="flex flex-col gap-4">
              {[
                { href: "/", label: "Beranda" },
                { href: "/menu", label: "Menu" },
                { href: "/order-history", label: "Riwayat Pesanan" },
                { href: "/#comments", label: "Live Chat" },
                { href: "/#about", label: "Tentang Kami" },
                { href: "/share", label: "📲 Bagikan" },
                { href: "/admin/login", label: "Admin" }
              ].map((l) => (
                <Link key={l.href} href={l.href} className="nav-link text-base border-b border-oreo-light pb-2 last:border-none" onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
              <div className="oreo-divider" />
              <Link href="/cart" className="btn-primary text-center text-sm flex items-center justify-center gap-2" onClick={() => setMobileOpen(false)}>
                <ShoppingCart size={15} />
                Keranjang {totalItems > 0 && `(${totalItems})`}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
