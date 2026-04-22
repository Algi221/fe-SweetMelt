"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Check, Copy, Download, Share2 } from "lucide-react";

const SITE_NAME = "SweetMelt";
const SHARE_TEXT = "🍪 Cobain dessert premium SweetMelt! Silky Pudding & Oreo Cheese Cake yang lembut dan enak banget. Order sekarang yuk! 🍫";

export default function SharePage() {
  const [copied, setCopied] = useState(false);
  // Dynamically get the current domain — works on localhost, Vercel, custom domain, etc.
  const [siteUrl, setSiteUrl] = useState("");

  useEffect(() => {
    setSiteUrl(window.location.origin);
  }, []);

  const qrUrl = siteUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(siteUrl)}&color=1a1a1a&bgcolor=ffffff&qzone=1&format=png`
    : "";
  const qrDownloadUrl = siteUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(siteUrl)}&color=1a1a1a&bgcolor=ffffff&qzone=2&format=png`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(siteUrl);
    } catch {
      const el = document.createElement("input");
      el.value = siteUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = async () => {
    const response = await fetch(qrDownloadUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sweetmelt-qrcode.png";
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(SHARE_TEXT + "\n\n" + siteUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(siteUrl)}`,
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: SITE_NAME, text: SHARE_TEXT, url: siteUrl });
      } catch { /* cancelled */ }
    } else {
      handleCopy();
    }
  };

  return (
    <main className="min-h-screen bg-oreo-white">
      <Navbar />

      {/* Hero */}
      <div className="bg-oreo-black pt-28 pb-36 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, #f5e6d3 0%, transparent 50%), radial-gradient(circle at 80% 20%, #c8a882 0%, transparent 40%)"
        }} />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-oreo-cream/20 border border-oreo-cream/30 rounded-full px-4 py-1.5 text-oreo-cream text-xs font-bold uppercase tracking-widest mb-4">
            <Share2 size={12} /> Bagikan SweetMelt
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-oreo-white mb-3">
            Sebar ke <span className="text-oreo-cream italic">Semua!</span>
          </h1>
          <p className="text-oreo-white/60 max-w-md mx-auto text-sm leading-relaxed">
            Ajak teman & keluarga kamu menikmati kelezatan SweetMelt. Scan QR atau bagikan linknya sekarang! 🍫
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-20 pb-16 space-y-6 relative z-10">

        {/* QR Code Card */}
        <div className="bg-oreo-white rounded-3xl border border-oreo-light shadow-oreo-lg overflow-hidden">
          <div className="p-6 text-center">
            <p className="text-xs font-bold text-oreo-black/40 uppercase tracking-widest mb-5">Scan QR Code</p>

            <div className="relative inline-block">
              <div className="bg-gradient-to-br from-oreo-black to-oreo-gray p-4 rounded-2xl shadow-xl">
                <div className="bg-white p-2 rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt="QR Code SweetMelt"
                    width={220}
                    height={220}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-oreo-cream/30 to-lumer/20 rounded-2xl blur-lg -z-10" />
            </div>

            <p className="text-xs text-oreo-black/40 mt-4 font-mono break-all">{siteUrl}</p>

            <button
              onClick={handleDownloadQR}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-oreo-black text-oreo-white text-sm font-bold hover:bg-oreo-gray transition-all hover:scale-[1.03] active:scale-95 shadow-oreo"
            >
              <Download size={15} /> Unduh QR Code
            </button>
          </div>
        </div>

        {/* Copy Link Card */}
        <div className="bg-oreo-white rounded-3xl border border-oreo-light shadow-oreo-lg p-6">
          <p className="text-xs font-bold text-oreo-black/40 uppercase tracking-widest mb-4">Salin Link</p>
          <div className="flex gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-mono text-sm text-oreo-black/70 truncate">
              {siteUrl}
            </div>
            <button
              onClick={handleCopy}
              className={`px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm ${
                copied
                  ? "bg-green-500 text-white scale-95"
                  : "bg-oreo-black text-oreo-white hover:bg-oreo-gray hover:scale-[1.03]"
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Tersalin!" : "Salin"}
            </button>
          </div>
        </div>

        {/* Share Buttons Card */}
        <div className="bg-oreo-white rounded-3xl border border-oreo-light shadow-oreo-lg p-6">
          <p className="text-xs font-bold text-oreo-black/40 uppercase tracking-widest mb-5">Bagikan Via</p>

          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp */}
            <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-all hover:scale-[1.02] active:scale-95 group">
              <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm text-[#25D366]">WhatsApp</p>
                <p className="text-xs text-oreo-black/40">Kirim via chat</p>
              </div>
            </a>

            {/* Instagram (Native Share) */}
            <button onClick={handleNativeShare}
              className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-300/30 hover:from-purple-500/20 hover:to-pink-500/20 transition-all hover:scale-[1.02] active:scale-95 w-full text-left">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)" }}>
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Instagram</p>
                <p className="text-xs text-oreo-black/40">Share story/feed</p>
              </div>
            </button>

            {/* TikTok */}
            <button onClick={handleCopy}
              className="flex items-center gap-3 p-4 rounded-2xl bg-black/5 border border-black/10 hover:bg-black/10 transition-all hover:scale-[1.02] active:scale-95 w-full text-left">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm text-oreo-black">TikTok</p>
                <p className="text-xs text-oreo-black/40">Salin & tempel link</p>
              </div>
            </button>

            {/* Twitter/X */}
            <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl bg-black/5 border border-black/10 hover:bg-black/10 transition-all hover:scale-[1.02] active:scale-95">
              <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.258 5.633L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
              </div>
              <div>
                <p className="font-bold text-sm text-oreo-black">X / Twitter</p>
                <p className="text-xs text-oreo-black/40">Post sekarang</p>
              </div>
            </a>
          </div>

          <div className="mt-4 p-3 bg-oreo-cream/30 rounded-xl text-center">
            <p className="text-xs text-oreo-black/50 leading-relaxed italic">
              💡 Untuk Instagram & TikTok, salin link lalu tempel di bio atau caption story kamu!
            </p>
          </div>
        </div>

        {/* CTA */}
        <a href="/menu"
          className="w-full py-4 rounded-2xl bg-oreo-black text-oreo-white font-bold text-center hover:bg-oreo-gray transition-all flex items-center justify-center gap-2 shadow-oreo hover:scale-[1.01] active:scale-95">
          🍪 Langsung Order Sekarang
        </a>
      </div>
    </main>
  );
}
