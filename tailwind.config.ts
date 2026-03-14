import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ===== OREO PALETTE (White & Black dominant) =====
        "oreo-black": "#111111",      // Almost true black
        "oreo-dark": "#1c1c1c",       // Dark card background
        "oreo-gray": "#2a2a2a",       // Secondary dark
        "oreo-white": "#ffffff",      // True white
        "oreo-cream": "#f9f1e0",      // Warmer Kremm
        "oreo-light": "#f1e6d5",      // Warmer Light Cream

        // ===== LUMER / CHOCOLATE ACCENTS =====
        "lumer": "#6b3a2a",           // Deep chocolate lumer
        "lumer-mid": "#8B4513",       // Saddle brown
        "lumer-light": "#c0631a",     // Orange-brown
        "choco": "#3d1f10",           // Very dark chocolate
        "caramel": "#d4750a",         // Warm caramel accent
        "gold": "#c9971a",            // Gold accent

        // ===== SEMANTIC =====
        "text-primary": "#111111",
        "text-secondary": "#4a4a4a",
        "text-light": "#888888",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // Core Oreo gradient: white top → off-white → cream
        "oreo-hero": "linear-gradient(180deg, #ffffff 0%, #f5f0ea 60%, #e8e0d5 100%)",
        // Chocolate drip texture for sections
        "choco-section": "linear-gradient(180deg, #1c1c1c 0%, #111111 100%)",
        // Lumer melting gradient
        "lumer-drip": "linear-gradient(180deg, #6b3a2a 0%, #3d1f10 100%)",
        // Oreo cookie pattern
        "oreo-pattern": "radial-gradient(circle at 30% 20%, rgba(107,58,42,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(107,58,42,0.06) 0%, transparent 50%)",
      },
      animation: {
        "drip": "drip 2.5s ease-in-out infinite",
        "drip-slow": "drip 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "melt": "melt 3s ease-in-out infinite",
      },
      keyframes: {
        drip: {
          "0%, 100%": { transform: "scaleY(1) translateY(0)", borderRadius: "0 0 50% 50%" },
          "50%": { transform: "scaleY(1.15) translateY(6px)", borderRadius: "0 0 60% 60%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-10px) rotate(2deg)" },
          "66%": { transform: "translateY(-6px) rotate(-1deg)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(32px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        melt: {
          "0%, 100%": { transform: "scaleX(1) scaleY(1)" },
          "50%": { transform: "scaleX(1.05) scaleY(0.95)" },
        },
      },
      boxShadow: {
        "oreo": "0 4px 24px rgba(17,17,17,0.12)",
        "oreo-lg": "0 8px 40px rgba(17,17,17,0.18)",
        "lumer": "0 4px 20px rgba(107,58,42,0.35)",
        "lumer-lg": "0 8px 40px rgba(107,58,42,0.4)",
        "white": "0 4px 24px rgba(255,255,255,0.15)",
        "caramel": "0 4px 20px rgba(201,151,26,0.3)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
