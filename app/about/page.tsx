"use client";

import React from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Heart, Users, Sparkles, Rocket, MessageCircle, ShieldAlert } from 'lucide-react';

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen font-sans selection:bg-lumer selection:text-oreo-black overflow-x-hidden">
      <Navbar />
      
      {/* Title / Hero - Zero Images, Pure Typography */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <Reveal>
          <div className="mb-12">
            <Image 
              src="/images/logo/SwwetMelt tpk..png" 
              alt="SweetMelt Logo" 
              width={180} 
              height={180}
              className="w-32 md:w-48 h-auto object-contain"
              priority
            />
          </div>
          <div className="inline-block bg-lumer/10 text-lumer px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            Behind the Melt
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display text-oreo-black tracking-tighter leading-[0.85] mb-12">
            Sebuah Cerita <br />
            Tentang Perjalanan <span className="text-lumer italic">SweetMelt.</span>
          </h1>
        </Reveal>
        
        <Reveal delay={0.2}>
          <div className="max-w-2xl">
            <p className="text-xl md:text-2xl text-oreo-black/60 leading-relaxed font-medium">
              Ini bukan cuma soal jualan makanan. Ini soal gimana kami bertahan di tengah badai ego dan kerusuhan.
            </p>
          </div>
        </Reveal>
      </section>

      {/* The Story Section */}
      <section className="py-24 px-6 bg-oreo-black text-white relative">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-lumer/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto space-y-24 relative z-10">
          
          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4">
                <span className="text-lumer font-black text-sm uppercase tracking-widest">Awal Mula</span>
              </div>
              <div className="md:col-span-8">
                <p className="text-xl md:text-2xl leading-relaxed text-white/80">
                  Semuanya berawal dari tugas sekolah. Kami, sekumpulan siswa dari kelas <span className="text-white font-bold underline decoration-lumer decoration-4 underline-offset-8">XI RPL 1</span>, ditantang buat bikin produk yang bisa dijual dan dipasarkan. 
                  Awalnya ya cuma ngejar nilai, tapi ternyata dinamikanya jauh lebih dalem dari itu.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4">
                <span className="text-rose-400 font-black text-sm uppercase tracking-widest">Chaos & Ego</span>
              </div>
              <div className="md:col-span-8">
                <p className="text-xl md:text-2xl leading-relaxed text-white/80">
                  Jujur aja, pas pengerjaannya tuh nggak se-sweet namanya. Banyak banget <span className="italic text-rose-300">miss comm</span>, kerusuhan kecil, sampe perbedaan pendapat yang bikin tensi naik. 
                  Ada masa-masa di mana ego kami masing-masing lebih dominan, bahkan sampe hampir ngalamin perpecahan. Ada yang ngerasa paling bener, ada yang ngerasa nggak didenger. Chaos banget pokoknya.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4">
                <span className="text-emerald-400 font-black text-sm uppercase tracking-widest">Persistence</span>
              </div>
              <div className="md:col-span-8">
                <p className="text-xl md:text-2xl leading-relaxed text-white/80">
                  Tapi di tengah semua perpecahan itu, ada satu hal yang bikin kami sadar: <span className="text-lumer font-bold">SweetMelt terlalu berharga buat dilepas.</span> Kami milih buat tetep bareng, ngeredam ego, dan mutusin buat pertahanin brand ini sampai sekarang. SweetMelt jadi bukti kalau kerusuhan nggak selalu berakhir dengan perpisahan.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The Lesson Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <Reveal>
          <div className="text-center mb-24">
             <h2 className="text-4xl md:text-6xl font-display text-oreo-black tracking-tight">Pelajaran Untuk <span className="text-lumer">Kita Semua</span></h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: MessageCircle,
              title: "Komunikasi Itu Kunci",
              text: "Miss comm itu wajar, tapi nggak boleh dibiarin lama. Ngobrol, dengerin, baru ambil keputusan bareng."
            },
            {
              icon: ShieldAlert,
              title: "Turunkan Ego",
              text: "Bangun sesuatu yang besar nggak bisa sendirian. Kadang kita harus ngalah demi keutuhan tim."
            },
            {
              icon: Rocket,
              title: "Konsistensi",
              text: "Masalah pasti ada, tapi sejauh mana kita mau bertahan? Itu yang nentuin hasil akhirnya."
            }
          ].map((item, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="p-10 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-lumer group-hover:text-white transition-colors">
                  <item.icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-oreo-black mb-4">{item.title}</h3>
                <p className="text-oreo-black/50 leading-relaxed text-sm">
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Final Quote */}
      <section className="py-24 px-6 text-center border-t border-slate-50 italic-none">
        <Reveal>
          <p className="text-oreo-black/40 text-xs font-black uppercase tracking-[0.4em] mb-10">SweetMelt Journey</p>
          <blockquote className="text-2xl md:text-5xl font-display text-oreo-black max-w-4xl mx-auto leading-tight tracking-tight">
            "Karena kelezatan sejati lahir dari perjuangan yang sungguh-sungguh, bahkan di tengah <span className="text-lumer">perbedaan.</span>"
          </blockquote>
          <div className="mt-12 flex items-center justify-center gap-4">
             <div className="w-12 h-[1px] bg-slate-200" />
             <p className="text-oreo-black font-bold text-sm">XI RPL 1 Creative Team</p>
             <div className="w-12 h-[1px] bg-slate-200" />
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
