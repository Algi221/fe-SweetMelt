"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import SequenceScroll from "@/components/SequenceScroll";
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from "lucide-react";
import Lenis from "lenis";

const featuredItems = [
  { 
    id: "oreo-cheese",
    image: "/images/oreoCheesseCake/1.jpeg", 
    name: "Oreo Cheese", 
    tagline: "Krim keju lumer dengan taburan biskuit Oreo yang renyah.", 
    dark: true 
  },
  { 
    id: "silky-pudding",
    image: "/images/pudingCoklat/1.jpeg", 
    name: "Silky Pudding Ball", 
    tagline: "Puding sutra lembut dengan pilihan rasa Coklat atau Strawberry.", 
    dark: false 
  },
];

const features = [
  { icon: <Truck size={22} />, title: "Gratis Ongkir", desc: "Untuk area tertentu" },
  { icon: <ShieldCheck size={22} />, title: "Terjamin Segar", desc: "Dibuat fresh setiap hari" },
  { icon: <Clock size={22} />, title: "Estimasi 1-2 Jam", desc: "Cepat sampai ke kamu" },
  { icon: <Star size={22} />, title: "4.9 ★ Rating", desc: "Dari 50+ pelanggan" },
];

function ChocoDrips({ fromTop = true }: { fromTop?: boolean }) {
  const drips = [
    { x: 5, h: 60, w: 18 }, { x: 14, h: 90, w: 14 }, { x: 23, h: 50, w: 20 },
    { x: 35, h: 75, w: 16 }, { x: 45, h: 40, w: 22 }, { x: 55, h: 85, w: 15 },
    { x: 65, h: 55, w: 19 }, { x: 75, h: 70, w: 17 }, { x: 85, h: 45, w: 21 },
    { x: 93, h: 65, w: 14 },
  ];
  return (
    <div className={`absolute ${fromTop ? "top-0" : "bottom-0 rotate-180"} left-0 right-0 overflow-hidden pointer-events-none z-10`} style={{ height: 110 }}>
      <svg viewBox="0 0 100 110" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {drips.map((d, i) => (
          <g key={i}>
            <rect x={d.x} y={0} width={d.w / 9} height={d.h} fill="#3d1f10" rx="2" />
            <ellipse cx={d.x + d.w / 18} cy={d.h + 8} rx={d.w / 16} ry={d.w / 14} fill="#3d1f10" />
          </g>
        ))}
        <rect x="0" y="0" width="100" height="6" fill="#3d1f10" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <main className="min-h-screen bg-oreo-white">
      <Navbar />

      {/* ─── SCROLLYTELLING HERO (Replaces Original Hero) ─── */}
      <SequenceScroll />

      {/* Wrapping the rest of the original design to overlap the scroll section if needed */}
      <div className="-mt-[100vh] relative z-20">
        
        {/* ─── FEATURES: White strip ─── */}
        <section className="bg-oreo-white border-b border-oreo-light py-10 relative z-10">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 bg-oreo-black rounded-full flex items-center justify-center text-oreo-white mb-1">{f.icon}</div>
                <p className="text-oreo-black font-semibold text-sm">{f.title}</p>
                <p className="text-oreo-black/50 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FEATURED MENU ─── */}
        <section id="featured" className="py-24 px-6 bg-oreo-white relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-lumer-mid text-xs font-bold tracking-widest uppercase mb-3 text-lumer">✨ Pilihan Terbaik</p>
              <h2 className="text-4xl md:text-5xl font-black text-oreo-black leading-tight mb-4 tracking-tighter uppercase italic">Menu <span className="text-lumer">Kami</span></h2>
              <div className="w-24 h-1.5 bg-lumer mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
              {featuredItems.map((item, i) => (
                <div
                  key={i}
                  className={`rounded-[2.5rem] overflow-hidden relative group hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col ${
                    item.dark
                      ? "bg-oreo-black text-oreo-white shadow-xl"
                      : "bg-oreo-cream border-2 border-oreo-light text-oreo-black shadow-lg"
                  }`}
                >
                  <div className="relative w-full h-64 overflow-hidden mb-6">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${item.dark ? 'from-oreo-black' : 'from-oreo-cream'} via-transparent to-transparent opacity-80`} />
                  </div>
                  
                  <div className="relative z-10 px-8 pb-8 flex-1 flex flex-col">
                    <h3 className={`text-2xl font-black mb-2 uppercase italic tracking-tight ${item.dark ? "text-oreo-white" : "text-oreo-black"}`}>
                      {item.name}
                    </h3>
                    <p className={`text-sm font-medium leading-relaxed ${item.dark ? "text-oreo-white/60" : "text-oreo-black/60"}`}>
                      {item.tagline}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/menu" className="inline-flex items-center gap-2 bg-oreo-black text-oreo-white hover:bg-lumer font-bold px-10 py-5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 text-base uppercase tracking-widest group">
                Lihat Semua Menu
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── ABOUT: Black section ─── */}
        <section id="about" className="relative bg-oreo-black py-32 px-6 overflow-hidden">
          <ChocoDrips fromTop={true} />

          <div className="max-w-3xl mx-auto text-center relative z-20 pt-12">
            <p className="text-lumer-light text-xs font-black tracking-[0.4em] uppercase mb-6">🍫 Tentang Kami</p>
            <h2 className="text-4xl md:text-6xl font-black text-oreo-white leading-tight mb-8 tracking-tighter uppercase italic">
              Dibuat dengan <br />
              <span className="italic text-oreo-cream">Cinta</span> & <span className="text-lumer">Usaha</span>
            </h2>
            <p className="text-oreo-white/60 text-lg leading-relaxed mb-16 font-medium">
              SweetMelt lahir untuk hadirkan dessert yang gak cuma enak, tapi juga bikin
              momen jadi lebih spesial. Setiap produk dibuat fresh dengan bahan berkualitas — karena kamu berhak dapat yang terbaik!
            </p>
            <div className="flex justify-center gap-12 md:gap-20">
              {[{ num: "500+", label: "Hapiness" }, { num: "20+", label: "Menu" }, { num: "4.9★", label: "Rating" }].map((s, i) => (
                <div key={i}>
                  <p className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">{s.num}</p>
                  <p className="text-white/30 text-[10px] uppercase font-black tracking-widest mt-2">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 rotate-180">
            <ChocoDrips fromTop={false} />
            <div className="h-6 bg-oreo-white" />
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="bg-oreo-white border-t border-oreo-light py-16 px-6 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-oreo-black flex items-center justify-center text-white font-black text-xl rotate-3">SM</div>
              <span className="font-display font-black text-oreo-black text-2xl tracking-tighter uppercase italic">
                Sweet<span className="text-lumer">Melt</span>
              </span>
            </div>
            <p className="text-oreo-black/40 text-xs font-bold uppercase tracking-widest text-center">© 2026 SweetMelt — Setiap Gigitan, Penuh Cita Rasa</p>
            <div className="flex items-center gap-8">
               <Link href="/menu" className="text-sm font-black text-oreo-black hover:text-lumer transition-colors uppercase tracking-widest">
                 Pesan Sekarang →
               </Link>
               <Link href="/admin/login" className="text-[10px] font-black text-oreo-black/10 hover:text-lumer transition-colors uppercase tracking-widest">
                 Admin
               </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
