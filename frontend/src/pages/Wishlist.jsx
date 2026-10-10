import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useShop } from "../context/ShopContext";
import { Heart, ArrowRight } from "lucide-react";

function Wishlist() {
  const { token, wishlist } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
                  My Saved Wishlist
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Keep track of products you love and add them to cart anytime.
                </p>
              </div>
            </div>

            {wishlist.length > 0 && (
              <span className="text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950 px-3.5 py-1.5 rounded-full border border-rose-200 dark:border-rose-800">
                {wishlist.length} Items Saved
              </span>
            )}
          </div>

          {!token ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md mx-auto my-8 space-y-4">
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl">
                🔒
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sign in to view Wishlist</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Log in to sync your favorite products across all devices.
              </p>
              <Link to="/login" className="btn-primary text-xs px-6 py-3.5 w-full">
                Login Now
              </Link>
            </div>
          ) : wishlist.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-14 text-center border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-md mx-auto my-8 space-y-4">
              <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950 text-rose-400 rounded-full flex items-center justify-center mx-auto text-3xl">
                ❤️
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Your Wishlist is Empty</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Tap the heart icon on any product card to save it for later!
              </p>
              <Link to="/" className="btn-primary text-sm px-8 py-3.5 inline-flex">
                <span>Discover Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Wishlist;