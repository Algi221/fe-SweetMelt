import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "SweetMelt — Setiap Gigitan, Penuh Kebahagiaan 🍪",
  description:
    "Pesan dessert terbaik: Oreo cheesecake, lumer cheese toast, molten chocolate, dan banyak lagi. Dikirim segar ke pintumu!",
  keywords: ["dessert", "oreo", "cheesecake", "lumer", "coklat", "pesan kue"],
  openGraph: {
    title: "SweetMelt — Setiap Gigitan, Penuh Kebahagiaan 🍪",
    description: "Dessert premium dengan bahan terbaik, langsung ke tanganmu.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      </head>
      <body className="bg-oreo-black min-h-screen antialiased">
        {children}
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 2000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #333',
            },
            success: {
              iconTheme: {
                primary: '#ffd700', // lumer color
                secondary: '#1a1a1a',
              },
            },
          }} 
        />
      </body>
    </html>
  );
}
