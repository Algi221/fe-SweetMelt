"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Instagram, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Heart 
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-oreo-white border-t border-oreo-light pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Column 1: Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-oreo-black flex items-center justify-center">
              <div className="w-6 h-6 rounded-full border-2 border-oreo-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-oreo-white" />
              </div>
            </div>
            <span className="font-display font-bold text-oreo-black text-2xl">
              Sweet<span className="text-lumer">Melt</span>
            </span>
          </div>
          <p className="text-oreo-black/50 text-sm leading-relaxed">
            Menghadirkan dessert premium dengan bahan berkualitas tinggi. Setiap gigitan adalah bentuk cinta kami untuk para pecinta manis.
          </p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-oreo-cream flex items-center justify-center text-oreo-black hover:bg-lumer hover:text-white transition-all">
              <Instagram size={18} />
            </a>
            <a href="https://wa.me/6289699893242" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-oreo-cream flex items-center justify-center text-oreo-black hover:bg-lumer hover:text-white transition-all">
              <MessageCircle size={18} />
            </a>
            <a href="mailto:hello@sweetmelt.com" className="w-10 h-10 rounded-full bg-oreo-cream flex items-center justify-center text-oreo-black hover:bg-lumer hover:text-white transition-all">
              <Mail size={18} />
            </a>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-display font-bold text-oreo-black text-lg mb-6 uppercase tracking-widest text-xs opacity-40">Tautan Cepat</h4>
          <ul className="space-y-4">
            {[
              { name: 'Beranda', href: '/' },
              { name: 'Katalog Menu', href: '/menu' },
              { name: 'Tentang Kami', href: '/about' },
              { name: 'Riwayat Pesanan', href: '/order-history' },
            ].map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="text-oreo-black/60 hover:text-lumer font-medium transition-colors text-sm">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 className="font-display font-bold text-oreo-black text-lg mb-6 uppercase tracking-widest text-xs opacity-40">Hubungi Kami</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm text-oreo-black/60">
              <MapPin size={18} className="text-lumer shrink-0" />
              <span>Jl. Pahlawan 1 No.43, RT.005/RW.024, Sukatani, Kec. Tapos, Kota Depok, Jawa Barat 16461</span>
            </li>
            <li className="flex items-center gap-3 text-sm text-oreo-black/60">
              <MessageCircle size={18} className="text-lumer shrink-0" />
              <span>+62 896-9989-3242</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Operational */}
        <div>
          <h4 className="font-display font-bold text-oreo-black text-lg mb-6 uppercase tracking-widest text-xs opacity-40">Pengiriman PO</h4>
          <div className="bg-lumer/5 border border-lumer/10 rounded-2xl p-5">
            <p className="text-oreo-black/70 text-sm font-bold mb-2">Selasa, 17 Maret 2026</p>
            <p className="text-oreo-black/50 text-xs leading-relaxed">
              Pengantaran dilakukan setiap hari Selasa. Pastikan sudah memesan sebelum hari Senin malam!
            </p>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-oreo-light flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-oreo-black/30 text-xs flex items-center gap-1">
          © {new Date().getFullYear()} SweetMelt. Developed by <Link href="https://github.com/Algi221" className="text-oreo-black/60 hover:text-lumer font-medium transition-colors text-sm">Algi</Link>
        </p>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-oreo-black/30 hover:text-oreo-black text-xs transition-colors">Privacy Policy</Link>
          <Link href="/" className="text-oreo-black/30 hover:text-oreo-black text-xs transition-colors">Terms of Service</Link>
          <Link href="/admin/login" className="text-oreo-black/10 hover:text-lumer text-[10px] transition-colors">Admin Login</Link>
        </div>
      </div>
    </footer>
  );
}
