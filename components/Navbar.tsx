"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Instagram, Twitter, Facebook, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Order", href: "/cart" },
    { name: "Admin", href: "/admin/login" },
  ];

  const socialLinks = [
    { icon: <Instagram size={20} />, href: "#" },
    { icon: <Twitter size={20} />, href: "#" },
    { icon: <Facebook size={20} />, href: "#" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 md:px-12 py-8 flex justify-between items-center pointer-events-none">
        {/* Logo */}
        <Link href="/" className="pointer-events-auto flex items-center gap-3 group">
           <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 text-xl font-black shadow-xl group-hover:rotate-12 transition-transform">
              SM
           </div>
           <span className={`font-display font-black text-2xl tracking-tighter uppercase italic transition-colors ${isOpen ? 'text-white' : 'text-white'}`}>
              Sweet<span className="text-lumer">Melt</span>
           </span>
        </Link>

        {/* Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto w-14 h-14 rounded-full bg-white text-slate-950 flex flex-col items-center justify-center gap-1.5 shadow-2xl hover:bg-lumer hover:text-white transition-all active:scale-90 group"
        >
          <motion.div 
            animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            className="w-6 h-[2px] bg-current rounded-full"
          />
          <motion.div 
            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-6 h-[2px] bg-current rounded-full"
          />
          <motion.div 
            animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            className="w-6 h-[2px] bg-current rounded-full"
          />
        </button>
      </nav>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[90] bg-slate-950 flex flex-col pt-40 px-6 md:px-32 pb-20 justify-between overflow-hidden"
          >
             {/* Background Text */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black text-white/5 uppercase select-none pointer-events-none leading-none italic">
                Sweet
             </div>

             <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em] mb-10">Navigation</p>
                   {navLinks.map((link, i) => (
                     <div key={i} className="overflow-hidden">
                        <motion.div
                          initial={{ y: 100 }}
                          animate={{ y: 0 }}
                          transition={{ delay: 0.3 + (i * 0.1), duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                        >
                          <Link 
                            href={link.href}
                            className={`group flex items-center gap-6 text-6xl md:text-9xl font-black uppercase italic tracking-tighter transition-all hover:pl-10 ${pathname === link.href ? 'text-lumer' : 'text-white/20 hover:text-white'}`}
                          >
                             {link.name} <ArrowRight className="opacity-0 group-hover:opacity-100 transition-all text-lumer" size={60} />
                          </Link>
                        </motion.div>
                     </div>
                   ))}
                </div>

                <div className="flex flex-col justify-end space-y-12">
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Social Media</p>
                      <div className="flex gap-6">
                         {socialLinks.map((s, i) => (
                           <Link key={i} href={s.href} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-lumer hover:border-lumer transition-all">
                              {s.icon}
                           </Link>
                         ))}
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.5em]">Contact Us</p>
                      <p className="text-2xl font-black text-white uppercase italic">SweetMelt@gmail.com <br /> +62 896-9989-3242</p>
                   </div>
                </div>
             </div>

             <div className="relative z-10 flex justify-between items-center text-[10px] font-black text-white/20 uppercase tracking-widest pt-20 border-t border-white/5">
                <p>© 2026 SweetMelt Artisan</p>
                <p>Designed for Perfection</p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
