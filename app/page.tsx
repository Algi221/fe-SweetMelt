"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CommentSection from "@/components/CommentSection";
import TextType from "@/components/TextType";
import ShinyText from "@/components/ShinyText";
import CountUp from "@/components/CountUp";
import LightRays from "@/components/LightRays";
import CurvedLoop from "@/components/CurvedLoop";
import { ArrowRight, Star, Truck, ShieldCheck, Clock, Instagram, MapPin, Mail, MessageCircle, Heart } from "lucide-react";

const featuredItems = [
  { image: "/images/oreoCheesseCake/1.jpeg", name: "Oreo Cheese", tagline: "Krim keju lumer dengan taburan biskuit Oreo yang renyah.", dark: true },
  { image: "/images/puding/1.jpeg", name: "Silky Pudding Ball", tagline: "Puding sutra lembut dengan pilihan rasa Coklat atau Strawberry.", dark: false },
];

const features = [
  { icon: <Truck size={22} />, title: "Gratis Ongkir", desc: "Untuk area tertentu" },
  { icon: <ShieldCheck size={22} />, title: "Terjamin Segar", desc: "Dibuat fresh setiap hari" },
  { icon: <Clock size={22} />, title: "Estimasi 1-2 Jam", desc: "Cepat sampai ke kamu" },
  { icon: <Star size={22} />, title: "4.9 ★ Rating", desc: "Dari 50+ pelanggan" },
];

// Chocolate drip SVG component
function ChocoDrips({ fromTop = true }: { fromTop?: boolean }) {
  const drips = [
    { x: 5, h: 60, w: 18 }, { x: 14, h: 90, w: 14 }, { x: 23, h: 50, w: 20 },
    { x: 35, h: 75, w: 16 }, { x: 45, h: 40, w: 22 }, { x: 55, h: 85, w: 15 },
    { x: 65, h: 55, w: 19 }, { x: 75, h: 70, w: 17 }, { x: 85, h: 45, w: 21 },
    { x: 93, h: 65, w: 14 },
  ];
  return (
    <div className={`absolute ${fromTop ? "top-0" : "bottom-0 rotate-180"} left-0 right-0 overflow-hidden pointer-events-none`} style={{ height: 110 }}>
      <svg viewBox="0 0 100 110" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {drips.map((d, i) => (
          <g key={i}>
            {/* Drip body */}
            <rect x={d.x} y={0} width={d.w / 9} height={d.h} fill="#3d1f10" rx="2" />
            {/* Drip bulb */}
            <ellipse cx={d.x + d.w / 18} cy={d.h + 8} rx={d.w / 16} ry={d.w / 14} fill="#3d1f10" />
          </g>
        ))}
        <rect x="0" y="0" width="100" height="6" fill="#3d1f10" />
      </svg>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-oreo-white">
      <Navbar />

      {/* ─── HERO: Full-screen BLACK (Oreo dark side) ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-oreo-black">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 25% 25%, #6b3a2a 0%, transparent 50%), radial-gradient(circle at 75% 75%, #3d1f10 0%, transparent 50%)"
        }} />

        {/* Cinematic Light Rays */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
          <LightRays
            raysOrigin="top-center"
            raysColor="#d4af37"
            raysSpeed={0.5}
            lightSpread={0.8}
            rayLength={2}
            followMouse={true}
            mouseInfluence={0.05}
          />
        </div>

        {/* Floating oreo cookies */}
        <div className="absolute top-24 left-12 text-6xl opacity-20 animate-float select-none">🍪</div>
        <div className="absolute top-32 right-16 text-4xl opacity-15 animate-float-slow select-none" style={{ animationDelay: "2s" }}>🍫</div>
        <div className="absolute bottom-40 left-20 text-5xl opacity-20 animate-float select-none" style={{ animationDelay: "3s" }}>🖤</div>
        <div className="absolute bottom-32 right-24 text-5xl opacity-15 animate-float-slow select-none" style={{ animationDelay: "1s" }}>🍪</div>

        {/* Hero text */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-oreo-white/10 border border-oreo-white/20 rounded-full px-5 py-2 text-sm mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-lumer-light rounded-full animate-pulse" />
            <ShinyText 
              text="Premium Dessert — Langsung ke Pintumu" 
              color="rgba(255,255,255,0.7)"
              shineColor="#ffffff"
              speed={3}
            />
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-black text-oreo-white leading-[1.1] mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Setiap Gigitan,<br />
            <TextType 
              text={["Penuh Rasa", "Lumer Terus", "Bikin Nagih"]}
              className="text-lumer"
              typingSpeed={100}
              pauseDuration={2000}
              cursorCharacter="_"
              cursorClassName="text-white/30"
            />
          </h1>

          <p className="text-oreo-white/60 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Dessert yang resepnya ga asal-asalan. Dari Oreo lumer sampai Cheese yang bikin nagih — semuanya ada di <span className="text-oreo-white font-semibold">SweetMelt!</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link href="/menu" className="bg-oreo-white text-oreo-black hover:bg-oreo-cream font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-white hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 group" id="hero-order-now">
              Pesan Sekarang
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/#about" className="border-2 border-oreo-white/30 text-oreo-white/80 hover:border-oreo-white hover:text-oreo-white font-semibold px-8 py-4 rounded-full transition-all duration-300">
              Tentang Kami →
            </Link>
          </div>
        </div>

        {/* Chocolate drips at bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0">
          <ChocoDrips fromTop={false} />
          <div className="h-8 bg-oreo-white" />
        </div>
      </section>

      {/* ─── FEATURES: White strip ─── */}
      <section className="bg-oreo-white border-b border-oreo-light py-10">
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

      {/* ─── FEATURED MENU: White bg ─── */}
      <section id="featured" className="py-24 px-6 bg-oreo-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-lumer-mid text-xs font-bold tracking-widest uppercase mb-3">✨ Pilihan Terbaik</p>
            <h2 className="section-title mb-4">Menu <span className="text-lumer">Kami</span></h2>
            <div className="oreo-divider max-w-xs mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
            {featuredItems.map((item, i) => (
              <div
                key={i}
                className={`rounded-4xl overflow-hidden relative group hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col ${
                  item.dark
                    ? "bg-oreo-black text-oreo-white shadow-oreo-lg"
                    : "bg-oreo-cream border-2 border-oreo-light text-oreo-black shadow-oreo"
                }`}
              >
                {/* Image top half */}
                <div className="relative w-full h-64 overflow-hidden mb-6">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Subtle gradient overlay to blend into the card color */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.dark ? 'from-oreo-black' : 'from-oreo-cream'} via-transparent to-transparent opacity-80`} />
                </div>
                
                <div className="relative z-10 px-8 pb-8 flex-1 flex flex-col">
                  <h3 className={`font-display text-xl font-bold mb-2 ${item.dark ? "text-oreo-white" : "text-oreo-black"}`}>
                    {item.name}
                  </h3>
                  <p className={`text-sm ${item.dark ? "text-oreo-white/60" : "text-oreo-black/60"}`}>
                    {item.tagline}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/menu" className="btn-primary inline-flex items-center gap-2 group text-base" id="see-all-menu">
              Lihat Semua Menu
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ARCHITECTURAL MARQUEE ─── */}
      <section className="bg-oreo-white overflow-hidden py-10">
        <CurvedLoop 
          marqueeText="PREMIUM DESSERT ✦ OREO MELT ✦ SILKY PUDDING ✦ FRESH MADE ✦ "
          speed={1.5}
          curveAmount={80}
          className="font-display italic text-oreo-black opacity-5"
        />
      </section>


      {/* ─── ABOUT: Black section (Oreo dark cookie) ─── */}
      <section id="about" className="relative bg-oreo-black py-28 px-6 overflow-hidden">
        {/* Top drips from white section */}
        <ChocoDrips fromTop={true} />

        <div className="max-w-3xl mx-auto text-center relative z-10 pt-8">
          <p className="text-lumer-light text-xs font-bold tracking-widest uppercase mb-4">🍫 Tentang Kami</p>
          <h2 className="section-title-white mb-6">
            Dibuat dengan{" "}
            <span className="italic text-oreo-cream">Cinta</span>{" "}
            &{" "}
            <span className="text-lumer">Usaha</span>
          </h2>
          <div className="mb-12">
            <ShinyText 
              text="SweetMelt lahir untuk hadirkan dessert yang gak cuma enak, tapi juga bikin momen jadi lebih spesial. Setiap produk dibuat fresh dengan bahan berkualitas — karena kamu berhak dapat yang terbaik!"
              className="text-lg leading-relaxed font-medium"
              color="rgba(255,255,255,0.55)"
              shineColor="#ffffff"
              speed={4}
            />
          </div>
          <div className="flex justify-center gap-16 md:gap-24">
            <div className="flex flex-col items-center">
              <p className="font-display text-5xl font-black text-oreo-white flex items-center">
                <CountUp from={0} to={50} duration={2} />
                <span className="text-lumer ml-1">+</span>
              </p>
              <p className="text-oreo-white/40 text-xs font-bold uppercase tracking-widest mt-2">Pelanggan Puas</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="font-display text-5xl font-black text-oreo-white flex items-center">
                <CountUp from={0} to={4.9} duration={2} />
                <span className="text-lumer-light text-2xl ml-1">★</span>
              </p>
              <p className="text-oreo-white/40 text-xs font-bold uppercase tracking-widest mt-2">Rating</p>
            </div>
          </div>
        </div>

        {/* Bottom drips back to white */}
        <div className="absolute bottom-0 left-0 right-0 rotate-180">
          <ChocoDrips fromTop={false} />
          <div className="h-6 bg-oreo-white" />
        </div>
      </section>
      {/* ─── READY TO ORDER CTA ─── */}
      <section className="bg-oreo-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto bg-oreo-black rounded-[3rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: "url('/images/oreo_pattern.png')", backgroundSize: "200px" }} />
          <div className="relative z-10">
            <h2 className="font-display text-4xl md:text-6xl font-black text-oreo-white mb-6 leading-tight">
              Siap untuk <br/><span className="text-lumer">Lumer</span> di Mulut?
            </h2>
            <p className="text-oreo-white/60 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
              Pesan sekarang untuk Pre-Order berikutnya dan rasakan kelezatan dessert premium kami langsung di rumahmu.
            </p>
            <Link href="/menu" className="inline-flex items-center gap-3 bg-lumer hover:bg-lumer-mid text-white font-bold px-10 py-5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl">
              Lihat Menu Sekarang <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MAP SECTION ─── */}
      <section className="bg-oreo-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-lumer-mid text-xs font-bold tracking-widest uppercase mb-3 text-center">📍 Kunjungi Kami</p>
            <h2 className="section-title mb-4">Lokasi <span className="text-lumer">Produksi</span></h2>
            <p className="text-oreo-black/50 text-sm max-w-md mx-auto">Tebarkan kebahagiaan dari dapur kami langsung ke pintu rumahmu.</p>
          </div>
          
          <div className="rounded-4xl overflow-hidden border-4 border-oreo-black shadow-oreo-lg h-[450px] relative group">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.176378453472!2d106.8920197750731!3d-6.362141993627916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69eb7458a5387f%3A0x2b523761a223a629!2sJl.%20Pahlawan%201%20No.43%2C%20RT.005%2FRW.024%2C%20Sukatani%2C%20Kec.%20Tapos%2C%20Kota%20Depok%2C%20Jawa%20Barat%2016461!5e0!3m2!1sid!2sid!4v1710570000000!5m2!1sid!2sid" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[0.5] contrast-[1.1] group-hover:grayscale-0 transition-all duration-700"
            ></iframe>
            
            {/* Overlay Info Card */}
            <div className="absolute bottom-6 left-6 right-6 md:right-auto md:w-80 bg-oreo-black text-oreo-white p-6 rounded-3xl shadow-2xl animate-fade-in">
              <div className="flex items-start gap-3">
                <MapPin className="text-lumer shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-lg mb-1">Dapur SweetMelt</h4>
                  <p className="text-xs text-oreo-white/60 leading-relaxed">
                    Jl. Pahlawan 1 No.43, RT.005/RW.024, Sukatani, Kec. Tapos, Kota Depok, Jawa Barat 16461
                  </p>
                  <a 
                    href="https://www.google.com/maps/dir/?api=1&destination=-6.362142,106.8920198" 
                    target="_blank" 
                    className="inline-flex items-center gap-2 text-lumer-light font-bold text-xs mt-4 hover:underline"
                  >
                    Petunjuk Arah <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── LIVE COMMENTS ─── */}
      <CommentSection />
      {/* ─── FOOTER ─── */}
      <Footer />
    </main>
  );
}
