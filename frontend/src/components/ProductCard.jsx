import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { Heart, ShoppingBag, Star, Zap, Check } from "lucide-react";

function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop";

  const isLiked = isInWishlist(product._id);
  const originalPrice = Math.round((product.price || 0) * 1.25);
  const discountPercent = Math.round(
    ((originalPrice - product.price) / originalPrice) * 100
  );

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    const success = await addToCart(product._id, 1);
    setAdding(false);
    if (success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product._id);
  };

  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500/50 shadow-sm hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      {/* Top badges & Wishlist Heart */}
      <div className="absolute top-3.5 inset-x-3.5 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          {discountPercent > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm">
              <Zap className="w-3 h-3 fill-current" /> {discountPercent}% OFF
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/40">
              Only {product.stock} left
            </span>
          )}
        </div>

        <button
          onClick={handleWishlistToggle}
          className={`pointer-events-auto p-2.5 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm ${
            isLiked
              ? "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 ring-2 ring-rose-300 dark:ring-rose-800"
              : "bg-white/90 dark:bg-slate-800/90 text-slate-500 dark:text-slate-300 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800 hover:scale-110"
          }`}
          title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-4 h-4 transition-transform ${
              isLiked ? "fill-current scale-110" : ""
            }`}
          />
        </button>
      </div>

      {/* Product Image Clickable Link */}
      <Link
        to={`/product/${product._id}`}
        className="relative block w-full pt-[85%] bg-slate-50 dark:bg-slate-800/50 overflow-hidden"
      >
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
          className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      </Link>

      {/* Card Content Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70 px-2.5 py-0.5 rounded-lg uppercase tracking-wider text-[10px]">
            {product.category || "General"}
          </span>
          <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-slate-700 dark:text-slate-200">4.8</span>
          </div>
        </div>

        {/* Product Title */}
        <Link to={`/product/${product._id}`} className="block group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          <h3 className="font-heading font-bold text-slate-900 dark:text-white text-base line-clamp-1 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed flex-1">
          {product.description || "High quality product from verified sellers."}
        </p>

        {/* Price & Action Button Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                ₹{Number(product.price || 0).toLocaleString("en-IN")}
              </span>
              {originalPrice > product.price && (
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                  ₹{Number(originalPrice).toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Free Delivery
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className={`relative px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 ${
              product.stock === 0
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : justAdded
                ? "bg-emerald-600 text-white"
                : "bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added
              </>
            ) : adding ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
