"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { ArrowLeft, ShoppingCart, Plus, Minus, Star, ShieldCheck, Truck, Sparkles, Heart } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  gallery_urls?: string[];
  categories?: { name: string; icon: string };
}

const formatPrice = (p: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const { items, addItem, updateQty } = useCart();
  const [variant, setVariant] = useState<string | undefined>(undefined);
  const [isLiked, setIsLiked] = useState(false);
  
  const isSilky = product?.name.toLowerCase().includes("silky") || false;

  useEffect(() => {
    if (!productId) return;
    fetch(`${API_URL}/api/products/${productId}`)
      .then((r) => r.json())
      .then((data) => {
        const prod = data.data;
        if (prod) {
          setProduct(prod);
          setMainImage(prod.image_url);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (isSilky && !variant) {
      setVariant("Coklat");
    }
  }, [product, isSilky, variant]);

  // Auto-switch image based on variant for Silky Pudding
  useEffect(() => {
    if (isSilky) {
       if (variant === "Coklat") setMainImage("/images/pudingCoklat/1.jpeg");
       if (variant === "Strawberry") setMainImage("/images/pudingStrawberry/1.jpeg");
    }
  }, [variant, isSilky]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-lumer/20 border-t-lumer rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-xl">🍪</div>
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Menyiapkan Dessert Anda...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl shadow-xl mb-6">🔍</div>
          <h1 className="font-display text-4xl text-slate-900 mb-3 font-black">デザートが見つかりません</h1>
          <p className="text-slate-500 mb-8 max-w-sm font-medium">Maaf, dessert yang Anda cari tidak tersedia dalam menu kami saat ini.</p>
          <Link href="/menu" className="px-8 py-3 bg-slate-950 text-white rounded-full font-bold shadow-lg hover:shadow-xl transition-all active:scale-95">Lihat Menu Lainnya</Link>
        </div>
      </main>
    );
  }

  const cartItem = items.find((i) => i.id === product.id && i.variant === variant);
  const qty = cartItem?.quantity || 0;
  const allImages = Array.from(new Set([product.image_url, ...(product.gallery_urls || [])])).filter(Boolean);

  return (
    <main className="min-h-screen bg-white selection:bg-lumer/30">
      <Navbar />

      <div className="relative">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-lumer/5 blur-[120px] rounded-full pointer-events-none -mr-40 -mt-20" />
        <div className="absolute bottom-40 left-0 w-1/3 h-[400px] bg-oreo-black/5 blur-[100px] rounded-full pointer-events-none -ml-20" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24 relative z-10">
          
          {/* Breadcrumb / Back */}
          <div className="mb-8 animate-slide-right">
             <Link href="/menu" className="inline-flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:border-slate-400 transition-all">
                   <ArrowLeft size={18} className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest">Kembali ke Menu</span>
             </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
            
            {/* LEFT: Image Gallery */}
            <div className="lg:col-span-7 space-y-6">
               <div className="relative group animate-fade-in shadow-2xl rounded-[2.5rem] overflow-hidden bg-slate-100 border-8 border-white">
                  {!imgError ? (
                    <img
                      src={mainImage}
                      alt={product.name}
                      className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center bg-slate-100 text-9xl">🍪</div>
                  )}
                  
                  {/* Floating Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2">
                    {product.categories && (
                      <div className="px-4 py-2 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl border border-white/20 flex items-center gap-2">
                         <span className="text-xl">{product.categories.icon}</span>
                         <span className="text-xs font-black uppercase tracking-widest text-slate-900">{product.categories.name}</span>
                      </div>
                    )}
                    <div className="px-4 py-2 rounded-2xl bg-lumer text-white shadow-xl border border-white/20 flex items-center gap-2">
                       <Sparkles size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Home Made</span>
                    </div>
                  </div>

                  <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className={`absolute top-6 right-6 w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-md border border-white/20 transition-all active:scale-75 ${isLiked ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-400'}`}>
                     <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                  </button>
               </div>

               {/* Thumbnails */}
               {allImages.length > 1 && (
                 <div className="flex gap-4 justify-center py-2 overflow-x-auto scrollbar-hide">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMainImage(img)}
                        className={`relative w-24 h-24 rounded-3xl overflow-hidden shrink-0 transition-all duration-300 border-4 ${
                          mainImage === img ? "border-lumer scale-105 shadow-xl rotate-2" : "border-white scale-100 opacity-60 hover:opacity-100 hover:scale-105"
                        }`}
                      >
                        <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                 </div>
               )}
            </div>

            {/* RIGHT: Product Info */}
            <div className="lg:col-span-5 flex flex-col pt-4">
               <div className="animate-slide-left space-y-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 animate-pulse">
                     <Star size={10} className="text-lumer fill-lumer" /> New Arrivals
                  </div>
                  
                  <h1 className="font-display text-5xl xl:text-7xl font-black text-slate-900 leading-[1.1] mb-2 tracking-tight">
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-lumer fill-lumer" />)}
                        <span className="ml-2 text-sm font-black text-slate-900">5.0</span>
                     </div>
                     <div className="h-4 w-px bg-slate-200" />
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">200+ Terjual</p>
                  </div>

                  <p className="text-lg text-slate-500 leading-relaxed font-medium transition-all max-w-lg">
                    {product.description || "Rasakan kelezatan premium dari olahan tangan terbaik kami. Setiap gigitan memberikan sensasi melt yang tak terlupakan."}
                  </p>

                  <div className="oreo-divider h-px bg-slate-100 w-full" />

                  {/* Flavor Selection */}
                  {isSilky && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Pilih Varian Rasa</p>
                         <span className="text-[10px] font-bold text-lumer underline cursor-pointer">Panduan Rasa</span>
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {["Coklat", "Strawberry"].map((v) => (
                          <button
                            key={v}
                            onClick={() => setVariant(v)}
                            className={`px-8 py-3.5 rounded-2xl font-black text-sm transition-all border-2 relative overflow-hidden group ${
                              variant === v 
                                ? "bg-slate-950 text-white border-slate-950 shadow-2xl scale-105" 
                                : "bg-white text-slate-500 border-slate-100 hover:border-slate-950/20 active:scale-95"
                            }`}
                          >
                            {v}
                            {variant === v && (
                              <div className="absolute top-1 right-1 w-2 h-2 bg-lumer rounded-full" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 rounded-[2rem] p-8 space-y-6 border border-slate-100 relative overflow-hidden group">
                     {/* Gloss Effect */}
                     <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                     
                     <div className="relative">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Total Harga</p>
                        <p className="text-5xl font-black text-slate-900">{formatPrice(product.price)}</p>
                     </div>

                     <div className="grid grid-cols-1 gap-4 relative">
                        {qty === 0 ? (
                          <button
                            onClick={() => {
                              addItem({ id: product.id, name: product.name, price: product.price, image_url: mainImage, variant });
                              toast.success(`${product.name} ${variant ? `(${variant})` : ""} ditambahkan!`, {
                                style: { background: '#000', color: '#fff', borderRadius: '20px', fontWeight: 'bold' }
                              });
                            }}
                            className="bg-slate-950 hover:bg-lumer text-white font-black px-8 py-5 rounded-2xl transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.15)] flex items-center justify-center gap-4 w-full text-lg active:scale-95 group/btn"
                          >
                            <ShoppingCart size={22} className="group-hover/btn:rotate-12 transition-transform" />
                            Tambahkan Pesanan
                          </button>
                        ) : (
                          <div className="flex items-center justify-between bg-white border-2 border-slate-950 rounded-2xl p-2 shadow-xl">
                            <button
                              onClick={() => updateQty(product.id, qty - 1, variant)}
                              className="w-14 h-14 rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200 transition-all flex items-center justify-center active:scale-90"
                            >
                              <Minus size={24} />
                            </button>
                            <div className="flex flex-col items-center">
                               <span className="text-2xl font-black text-slate-950">{qty}</span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Dalam Keranjang</span>
                            </div>
                            <button
                              onClick={() => updateQty(product.id, qty + 1, variant)}
                              className="w-14 h-14 rounded-xl bg-slate-950 text-white hover:bg-lumer transition-all flex items-center justify-center shadow-lg active:scale-90"
                            >
                              <Plus size={24} />
                            </button>
                          </div>
                        )}
                     </div>

                     {/* Extra Info */}
                     <div className="pt-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <ShieldCheck size={14} className="text-emerald-500" />
                           </div>
                           Terjamin Segar & Kualitas Premium
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 font-bold text-xs">
                           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <Truck size={14} className="text-blue-500" />
                           </div>
                           Pengiriman Langsung dari Kitchen
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Bottom Section: Descriptions / Reviews Placeholder */}
          <div className="mt-32 border-t border-slate-100 pt-20">
             <div className="grid lg:grid-cols-2 gap-16">
                <div className="space-y-6">
                   <h3 className="text-3xl font-black text-slate-950">Kenapa Harus <span className="text-lumer italic underline decoration-wavy">SweetMelt?</span></h3>
                   <p className="text-slate-500 text-lg leading-relaxed font-medium">
                      Kami berkomitmen menggunakan bahan-bahan grade A mulai dari coklat belgian asli hingga buah segar pilihan. Proses pembuatan 100% higienis dan fresh made demi menjaga cita rasa autentik produk kami.
                   </p>
                   <ul className="grid grid-cols-2 gap-4">
                      {['No Preservatives', 'Higienis', 'Freshly Baked', 'Lumer di Mulut'].map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm font-black text-slate-700">
                           <div className="w-2 h-2 bg-lumer rounded-full" /> {f}
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="bg-lumer/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center border border-lumer/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">🍪</div>
                   <h4 className="text-2xl font-black text-slate-950 mb-4">Punya Pertanyaan Spesial?</h4>
                   <p className="text-slate-600 mb-8 max-w-xs font-medium italic text-sm">Ingin pesan dalam jumlah besar untuk acara atau request rasa spesial? Hubungi tim kami sekarang.</p>
                   <button className="flex items-center gap-2 px-8 py-3 bg-white text-slate-900 border border-slate-200 rounded-full font-black text-xs uppercase tracking-widest hover:border-lumer hover:text-lumer transition-all shadow-sm">
                      Konsultasi Pesanan
                   </button>
                </div>
             </div>
          </div>

        </div>
      </div>
    </main>
  );
}
