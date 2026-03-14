import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SweetMelt | Premium Homemade Desserts",
  description: "Setiap gigitan penuh cita rasa. Spesialis Oreo Cheesecake & Silky Pudding premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${outfit.variable} font-sans antialiased bg-[#3d1f10]`}>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
