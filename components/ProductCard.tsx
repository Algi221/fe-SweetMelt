"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart } from "@/lib/cartStore";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  categories?: { name: string; icon: string };
}

export default function ProductCard({ product }: { product: Product }) {
  const { addItem, items, updateQty } = useCart();
  const [imgError, setImgError] = useState(false);
  const cartItem = items.find((i) => i.id === product.id);
  const qty = cartItem?.quantity || 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  return (
    <div className="card-oreo group flex flex-col" id={`product-${product.id}`}>
      {/* Image */}
      <Link href={`/product/${product.id}`} className="relative h-52 overflow-hidden bg-oreo-cream block">
        {!imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-oreo-cream">
            <span className="text-6xl">🍪</span>
          </div>
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-oreo-black/0 group-hover:bg-oreo-black/10 transition-all duration-300" />

        {/* Category badge */}
        {product.categories && (
          <div className="absolute top-3 left-3">
            <span className="badge bg-oreo-black text-oreo-white text-xs">
              {product.categories.icon} {product.categories.name}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex-1">
          <Link href={`/product/${product.id}`} className="hover:text-lumer-mid transition-colors">
            <h3 className="font-display text-lg font-semibold text-oreo-black leading-tight mb-1.5">
              {product.name}
            </h3>
          </Link>
          <p className="text-oreo-black/50 text-sm leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-lg text-oreo-black">
            {formatPrice(product.price)}
          </span>

          {qty === 0 ? (
            <button
              onClick={(e) => {
                if (product.name.toLowerCase().includes("silky")) {
                   // Redirect to detail page to pick variant
                   window.location.href = `/product/${product.id}`;
                   return;
                }
                addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url });
                toast.success(`${product.name} masuk keranjang! 🎉`);
              }}
              className="flex items-center gap-1.5 btn-primary py-2 px-4 text-sm"
              id={`add-to-cart-${product.id}`}
            >
              <ShoppingCart size={14} />
              {product.name.toLowerCase().includes("silky") ? "Pilih Rasa" : "Tambah"}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(product.id, qty - 1)}
                className="w-8 h-8 rounded-full border-2 border-oreo-black text-oreo-black hover:bg-oreo-black hover:text-oreo-white transition-all flex items-center justify-center"
                id={`decrease-${product.id}`}
              >
                <Minus size={13} />
              </button>
              <span className="text-oreo-black font-bold w-6 text-center">{qty}</span>
              <button
                onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image_url: product.image_url })}
                className="w-8 h-8 rounded-full bg-oreo-black text-oreo-white hover:bg-oreo-gray transition-all flex items-center justify-center"
                id={`increase-${product.id}`}
              >
                <Plus size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
