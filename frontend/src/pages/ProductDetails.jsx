import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";
import { useToast } from "../context/ToastContext";
import {
  Star,
  ShoppingBag,
  Zap,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useShop();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);

      if (res.data?.category) {
        const allRes = await api.get("/products");
        const filtered = allRes.data
          .filter(
            (p) =>
              p.category === res.data.category && p._id !== res.data._id
          )
          .slice(0, 4);
        setRelatedProducts(filtered);
      }
    } catch (error) {
      console.error(error);
      showToast("Product not found or unavailable", "error");
    } finally {
      setLoading(false);
    }
  };

  const isLiked = product ? isInWishlist(product._id) : false;

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    await addToCart(product._id, quantity);
    setAdding(false);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    const ok = await addToCart(product._id, quantity, false);
    if (ok) {
      navigate("/checkout");
    }
  };

  const originalPrice = product ? Math.round(product.price * 1.25) : 0;
  const savings = product ? originalPrice - product.price : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="w-full h-96 skeleton-box rounded-3xl" />
            <div className="space-y-4">
              <div className="w-1/3 h-6 skeleton-box rounded-lg" />
              <div className="w-3/4 h-10 skeleton-box rounded-lg" />
              <div className="w-1/2 h-8 skeleton-box rounded-lg" />
              <div className="w-full h-32 skeleton-box rounded-2xl" />
              <div className="w-full h-14 skeleton-box rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-md">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Product Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">The product you are looking for might have been removed.</p>
            <Link to="/" className="btn-primary mt-6 text-sm">
              Back to Store
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
            <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              to={`/?category=${encodeURIComponent(product.category || "All")}`}
              className="hover:text-brand-600 dark:hover:text-brand-400 transition"
            >
              {product.category || "Products"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 dark:text-white font-bold truncate max-w-xs">
              {product.name}
            </span>
          </nav>

          {/* MAIN PRODUCT DETAIL GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 lg:p-10">
            {/* LEFT IMAGE GALLERY */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="relative rounded-3xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-8 flex items-center justify-center overflow-hidden group">
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-md transition-all z-10 ${
                    isLiked
                      ? "bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 ring-2 ring-rose-400"
                      : "bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:scale-110"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                  />
                </button>

                <img
                  src={product.image || fallbackImage}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                  className="w-full max-h-[440px] object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Guarantees Box */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                  <Truck className="w-5 h-5 mx-auto text-brand-600 dark:text-brand-400 mb-1" />
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">Free Express</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Fast 2-day delivery</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                  <ShieldCheck className="w-5 h-5 mx-auto text-emerald-600 dark:text-emerald-400 mb-1" />
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">1-Yr Warranty</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Official Brand Cover</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                  <RotateCcw className="w-5 h-5 mx-auto text-amber-600 dark:text-amber-400 mb-1" />
                  <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">7-Day Return</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Hassle-free exchange</p>
                </div>
              </div>
            </div>

            {/* RIGHT PRODUCT INFO */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300">
                    {product.category || "General"}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>4.8</span>
                    <span className="text-slate-400 dark:text-slate-500 font-normal">| 1,420 Ratings</span>
                  </div>
                  {product.stock > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-xl">
                      <CheckCircle className="w-3.5 h-3.5" /> In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2.5 py-1 rounded-xl">
                      Out of Stock
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-slate-900 dark:text-white leading-tight">
                  {product.name}
                </h1>

                {/* Price Section */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 dark:from-slate-800/80 dark:to-indigo-950/40 border border-slate-100 dark:border-slate-800 flex flex-wrap items-baseline gap-3">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">
                    ₹{Number(product.price || 0).toLocaleString("en-IN")}
                  </span>
                  {originalPrice > product.price && (
                    <span className="text-lg text-slate-400 dark:text-slate-500 line-through">
                      ₹{Number(originalPrice).toLocaleString("en-IN")}
                    </span>
                  )}
                  {savings > 0 && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm">
                      Save ₹{savings.toLocaleString("en-IN")} (20% OFF)
                    </span>
                  )}
                  <p className="w-full text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
                    Inclusive of all taxes • Instant bank discount available at checkout
                  </p>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {product.description}
                </p>

                {/* Quantity Selector */}
                <div className="pt-2 flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold flex items-center justify-center transition shadow-sm"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-extrabold text-slate-900 dark:text-white text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock || 10, q + 1))
                      }
                      className="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold flex items-center justify-center transition shadow-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="pt-8 border-t border-slate-100 dark:border-slate-800 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={adding || product.stock === 0}
                  className="btn-secondary py-4 text-sm font-bold border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100/70 dark:hover:bg-brand-900/60"
                >
                  <ShoppingBag className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  <span>{adding ? "Adding..." : "Add to Cart"}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="btn-primary py-4 text-sm font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 shadow-glow-accent/30"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Buy Now Instantly</span>
                </button>
              </div>
            </div>
          </div>

          {/* TABBED DETAILS */}
          <div className="mt-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8">
            <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 pb-4">
              <button
                onClick={() => setActiveTab("description")}
                className={`text-sm font-bold pb-2 transition relative ${
                  activeTab === "description"
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Overview & Specs
                {activeTab === "description" && (
                  <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("reviews")}
                className={`text-sm font-bold pb-2 transition relative ${
                  activeTab === "reviews"
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Ratings & Reviews (128)
                {activeTab === "reviews" && (
                  <span className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-brand-600 dark:bg-brand-400 rounded-full" />
                )}
              </button>
            </div>

            <div className="py-6">
              {activeTab === "description" ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      Product Highlights
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Category</span>
                      <span className="font-bold text-slate-900 dark:text-white">{product.category || "General"}</span>
                    </div>
                    <div className="flex justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Stock Availability</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{product.stock || 0} Units Available</span>
                    </div>
                    <div className="flex justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Warranty</span>
                      <span className="font-bold text-slate-900 dark:text-white">1 Year Brand Warranty</span>
                    </div>
                    <div className="flex justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Authenticity</span>
                      <span className="font-bold text-slate-900 dark:text-white">100% Genuine Guaranteed</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Aman Sharma</span>
                      <div className="flex text-amber-400 text-xs">★★★★★</div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Super fast delivery and the product build quality exceeded my expectations. Total value for money!
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">Priya Verma</span>
                      <div className="flex text-amber-400 text-xs">★★★★☆</div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Genuine product with official warranty. Working smoothly without any issues.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SIMILAR PRODUCTS */}
          {relatedProducts.length > 0 && (
            <div className="mt-14">
              <h3 className="text-2xl font-heading font-black text-slate-900 dark:text-white mb-6">
                Similar Products You May Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetails;