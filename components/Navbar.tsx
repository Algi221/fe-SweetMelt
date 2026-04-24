"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Share2 } from "lucide-react";
import { useCart } from "@/lib/cartStore";

import { motion, AnimatePresence } from "framer-motion";

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

  // Body lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [mobileOpen]);

  // On non-home pages, always show dark navbar
  const isHome = pathname === "/";
  const showDark = !isHome || scrolled || !heroBg;

  const menuLinks = [
    { href: "/", label: "Beranda" },
    { href: "/menu", label: "Menu" },
    { href: "/order-history", label: "Pesanan" },
    { href: "/about", label: "Tentang" },
    { href: "/share", label: "Bagikan" },
    { href: "/admin/login", label: "Dashboard Admin" }
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled || !isHome
            ? "glassmorphism-light shadow-oreo py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between relative h-14 md:h-16">

            {/* Left nav links / Mobile Spacer */}
            <div className="flex-1 flex items-center">
              <div className="hidden md:flex items-center gap-8">
                <Link href="/" className={showDark ? "nav-link font-medium" : "nav-link-white"}>
                  Beranda
                </Link>
                <Link href="/menu" className={`${showDark ? "nav-link" : "nav-link-white"} ${pathname === "/menu" ? "font-bold text-lumer" : ""}`}>
                  Menu
                </Link>
                <Link href="/order-history" className={`${showDark ? "nav-link" : "nav-link-white"} ${pathname === "/order-history" ? "font-bold text-lumer" : ""}`}>
                  Pesanan
                </Link>
              </div>
            </div>

            {/* Center logo — flex centered on mobile, absolute on desktop to keep it perfect */}
            <div className="flex-1 md:absolute md:left-1/2 md:-translate-x-1/2 flex justify-center md:block z-10">
              <Link
                href="/"
                className="flex items-center gap-2 group"
              >
                <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${showDark ? "bg-oreo-black" : "bg-oreo-white"}`}>
                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${showDark ? "border-oreo-white" : "border-oreo-black"}`}>
                    <div className={`w-1.5 h-1.5 md:w-2 h-2 rounded-full ${showDark ? "bg-oreo-white" : "bg-oreo-black"}`} />
                  </div>
                </div>
                <span className={`font-display text-lg md:text-xl font-bold tracking-wide transition-colors duration-300 ${showDark ? "text-oreo-black" : "text-oreo-white"}`}>
                  Sweet<span className={showDark ? "text-lumer" : "text-caramel"}>Melt</span>
                </span>
              </Link>
            </div>

            {/* Right items */}
            <div className="flex items-center justify-end gap-2 md:gap-8 flex-1">
              <Link href="/share" className={`hidden lg:flex items-center gap-1 ${showDark ? "nav-link" : "nav-link-white"} ${pathname === "/share" ? "font-semibold" : ""}`}>
                <Share2 size={13} /> Share
              </Link>
              <Link href="/about" className={`hidden md:block ${showDark ? "nav-link" : "nav-link-white"} ${pathname === "/about" ? "font-bold text-lumer" : ""}`}>
                Tentang
              </Link>
              <Link
                href="/cart"
                className={`relative flex items-center gap-1.5 font-bold text-xs md:text-sm p-2.5 md:px-5 md:py-2.5 rounded-full transition-all duration-300 shadow-sm ${
                  showDark
                    ? "bg-oreo-black text-oreo-white hover:bg-oreo-gray"
                    : "bg-oreo-white text-oreo-black hover:bg-oreo-cream"
                }`}
                id="cart-button"
              >
                <ShoppingCart size={16} className="md:size-[15px]" />
                <span className="hidden sm:inline">Keranjang</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-lumer text-oreo-white w-4.5 h-4.5 md:w-5 md:h-5 rounded-full text-[9px] md:text-[10px] font-black flex items-center justify-center border-2 border-oreo-white">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile toggle */}
              <button
                className={`md:hidden p-2 rounded-xl transition-all ${showDark ? "text-oreo-black bg-oreo-cream/30" : "text-oreo-white bg-white/10"}`}
                onClick={() => setMobileOpen(true)}
                id="mobile-menu-toggle"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Full Modal Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-oreo-black flex flex-col p-8"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden text-oreo-white/20 select-none flex flex-wrap gap-10 p-10 font-black text-6xl rotate-12">
               {Array(30).fill(0).map((_, i) => <span key={i}>SweetMelt</span>)}
            </div>

            <div className="flex justify-between items-center relative z-10">
               <div className="flex items-center gap-2">
                 <div className="w-10 h-10 rounded-full bg-oreo-white flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full border-2 border-oreo-black flex items-center justify-center">
                       <div className="w-2.5 h-2.5 bg-oreo-black rounded-full" />
                    </div>
                 </div>
                 <span className="font-display text-2xl font-bold text-oreo-white">Sweet<span className="text-lumer">Melt</span></span>
               </div>
               <button 
                 onClick={() => setMobileOpen(false)}
                 className="w-12 h-12 rounded-full bg-oreo-white/10 text-oreo-white flex items-center justify-center hover:bg-lumer hover:scale-110 transition-all"
               >
                 <X size={28} />
               </button>
            </div>

            <div className="flex-1 flex flex-col justify-center items-start gap-10 relative z-10 pl-4">
               {menuLinks.map((link, idx) => {
                 const isAdmin = link.href.includes('admin');
                 return (
                   <motion.div
                     key={link.href}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: 0.1 + idx * 0.05 }}
                   >
                     <Link 
                       href={link.href} 
                       onClick={() => setMobileOpen(false)}
                       className={`font-display font-bold transition-all tracking-tight ${
                         pathname === link.href 
                           ? "text-lumer text-4xl" 
                           : isAdmin 
                             ? "text-lg text-oreo-white/20 hover:text-oreo-white/40 mt-4" 
                             : "text-3xl text-oreo-white/60 hover:text-oreo-white"
                       }`}
                     >
                       {link.label}
                       {isAdmin && <span className="text-[10px] ml-2 opacity-50 font-sans tracking-widest border border-white/10 px-2 py-0.5 rounded-md uppercase">Private</span>}
                     </Link>
                   </motion.div>
                 );
               })}
            </div>

            <div className="mt-auto space-y-4 relative z-10">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.5 }}
               >
                 <Link 
                   href="/cart" 
                   onClick={() => setMobileOpen(false)}
                   className="w-full py-5 rounded-3xl bg-lumer text-oreo-white font-black text-xl flex items-center justify-center gap-4 shadow-xl shadow-lumer/20 active:scale-95 transition-transform"
                 >
                   <ShoppingCart size={24} />
                   Buka Keranjang {totalItems > 0 && <span>({totalItems})</span>}
                 </Link>
               </motion.div>
               
               <p className="text-center text-oreo-white/20 text-xs font-bold uppercase tracking-widest">
                  🍪 lumer di mulut, manis di hati 🍪
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
