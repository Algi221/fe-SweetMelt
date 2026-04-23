import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, Star, Sparkles, Coffee } from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami - SweetMelt',
  description: 'Kisah dibalik kelezatan donet lumer premium SweetMelt.',
};

export default function AboutPage() {
  return (
    <main className="bg-oreo-white min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-oreo-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lumer/10 rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-lumer/5 rounded-full -ml-48 -mb-48 blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-7xl text-oreo-white mb-6">
            Cerita <span className="text-lumer">Manis</span> Kami
          </h1>
          <p className="text-oreo-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Lebih dari sekadar donat. SweetMelt adalah perwujudan dari cinta, eksperimen rasa, dan keinginan untuk menghadirkan kebahagiaan di setiap gigitan.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square rounded-[40px] bg-oreo-cream overflow-hidden shadow-2xl relative z-10">
               <img 
                 src="https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=800" 
                 alt="Chef SweetMelt" 
                 className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all duration-700"
               />
            </div>
            <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-lumer rounded-[40px] z-0" />
          </div>
          
          <div className="space-y-8">
            <div className="inline-block bg-lumer/10 text-lumer px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
              Filosofi Kami
            </div>
            <h2 className="section-title text-left">Dibuat Dengan <span className="text-lumer">Hati</span>, Disajikan Dengan Cinta</h2>
            <p className="text-oreo-black/60 leading-relaxed">
              Didirikan pada tahun 2023, SweetMelt lahir dari dapur kecil dengan satu misi sederhana: menciptakan donat dengan tekstur paling lembut yang pernah ada. Kami percaya bahwa kualitas tidak bisa dikompromi.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 bg-oreo-cream/50 rounded-2xl border border-oreo-light">
                <Heart className="text-lumer mb-3" size={24} />
                <h4 className="font-bold text-sm mb-1">Bahan Premium</h4>
                <p className="text-xs text-oreo-black/50">Cokelat asli dan tepung kualitas terbaik.</p>
              </div>
              <div className="p-4 bg-oreo-cream/50 rounded-2xl border border-oreo-light">
                <Sparkles className="text-lumer mb-3" size={24} />
                <h4 className="font-bold text-sm mb-1">Fresh Every Day</h4>
                <p className="text-xs text-oreo-black/50">Selalu baru, tidak ada stok sisa kemarin.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-oreo-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-display text-oreo-black mb-2">50k+</div>
              <div className="text-xs uppercase tracking-widest font-bold text-oreo-black/40">Donat Terjual</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display text-oreo-black mb-2">12k</div>
              <div className="text-xs uppercase tracking-widest font-bold text-oreo-black/40">Pelanggan Puas</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display text-oreo-black mb-2">15</div>
              <div className="text-xs uppercase tracking-widest font-bold text-oreo-black/40">Varian Rasa</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-display text-oreo-black mb-2">4.9</div>
              <div className="text-xs uppercase tracking-widest font-bold text-oreo-black/40">Rating Rata-rata</div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Mission */}
      <section className="py-24 max-w-5xl mx-auto px-6 text-center">
        <div className="mb-16">
          <h2 className="section-title">Visi & <span className="text-lumer">Misi</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-10 bg-oreo-white border border-oreo-light rounded-[32px] shadow-oreo hover:-translate-y-2 transition-transform duration-500">
            <div className="w-14 h-14 bg-lumer/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Star className="text-lumer" size={28} />
            </div>
            <h3 className="text-xl font-display text-oreo-black mb-4">Visi Kami</h3>
            <p className="text-oreo-black/60 text-sm leading-relaxed">
              Menjadi brand donat lumer nomor satu di Indonesia yang dikenal karena kualitas premium dan inovasi rasa yang tak terbatas.
            </p>
          </div>
          
          <div className="p-10 bg-oreo-white border border-oreo-light rounded-[32px] shadow-oreo hover:-translate-y-2 transition-transform duration-500">
            <div className="w-14 h-14 bg-lumer/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Coffee className="text-lumer" size={28} />
            </div>
            <h3 className="text-xl font-display text-oreo-black mb-4">Misi Kami</h3>
            <p className="text-oreo-black/60 text-sm leading-relaxed">
              Terus berinovasi menciptakan kebahagiaan melalui donat yang dibuat dari bahan-bahan organik dan pelayanan yang ramah sepenuh hati.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
