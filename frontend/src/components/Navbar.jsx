import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { useTheme } from "../context/ThemeContext";
import {
  Search,
  ShoppingCart,
  Heart,
  Package,
  ShieldCheck,
  LogOut,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, logout, cartCount, wishlistCount } = useShop();
  const { isDark, toggleTheme } = useTheme();

  const searchParams = new URLSearchParams(location.search);
  const currentQuery = searchParams.get("search") || "";

  const [search, setSearch] = useState(currentQuery);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Check if current logged-in user is admin (e.g. harshit123456@gmail.com)
  const isAdmin =
    Boolean(token) &&
    Boolean(user) &&
    (user.role === "admin" ||
      user.isAdmin === true ||
      user.email?.toLowerCase() === "harshit123456@gmail.com" ||
      user.email?.toLowerCase()?.startsWith("harshit123456"));

  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = search.trim();
    if (!keyword) {
      navigate("/");
      return;
    }
    navigate(`/?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-all">
      {/* Top micro banner */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white text-xs font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-accent-light animate-pulse" />
        <span>Grand Festival Sale: Up to <strong>70% OFF</strong> + Free Delivery on Orders Over ₹499!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 md:gap-8">
          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <span className="text-white text-2xl font-black tracking-tighter">Q</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center">
                Quick<span className="text-brand-600 dark:text-brand-400">Kart</span>
                <span className="ml-1 text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 tracking-wider">PRO</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 -mt-1 tracking-wider uppercase">
                Modern E-Commerce
              </span>
            </div>
          </Link>

          {/* SEARCH BAR */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl hidden md:flex items-center relative group"
          >
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-brand-600 dark:group-focus-within:text-brand-400 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search products, brands, categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-24 py-3 bg-slate-100/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-brand-500 dark:focus:border-brand-400 rounded-2xl text-slate-800 dark:text-slate-100 text-sm font-medium outline-none transition-all shadow-inner focus:shadow-glow-primary/10"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-brand-600 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* RIGHT NAVIGATION ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* THEME TOGGLE SWITCH */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-amber-400 hover:bg-slate-200/80 dark:hover:bg-slate-800 transition shadow-sm border border-slate-200/60 dark:border-slate-800 flex items-center justify-center"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 animate-spin-slow text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Orders */}
            <Link
              to="/orders"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50/60 dark:hover:bg-slate-900 font-semibold text-sm transition"
            >
              <Package className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>Orders</span>
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-rose-600 hover:bg-rose-50/60 dark:hover:bg-slate-900 transition group"
              title="Wishlist"
            >
              <Heart className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-rose-500 group-hover:scale-110 transition-transform" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[11px] font-black text-white shadow-sm ring-2 ring-white dark:ring-slate-950 animate-pulse-subtle">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100/80 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 font-bold text-sm transition group border border-brand-200/60 dark:border-brand-800/60 shadow-sm"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 dark:bg-brand-500 px-1.5 text-[11px] font-black text-white shadow ring-2 ring-white dark:ring-slate-950">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            {/* Admin Portal (ONLY visible to harshit123456@gmail.com / Admin) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold tracking-wide transition shadow-sm border border-transparent dark:border-slate-700"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Admin</span>
              </Link>
            )}

            {/* User Dropdown / Auth CTA */}
            {token ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold text-sm transition border border-slate-200/60 dark:border-slate-800"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center text-xs font-black shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate text-xs font-bold">
                    {user?.name || "Account"}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-slide-up">
                      <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                          {user?.name || "User"}
                        </p>
                        {user?.email && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        )}
                      </div>
                      <Link
                        to="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <Package className="w-4 h-4 text-brand-600" />
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                      >
                        <Heart className="w-4 h-4 text-rose-500" />
                        My Wishlist ({wishlistCount})
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-brand-600 dark:hover:text-brand-400 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-brand-500/20 transition active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 md:hidden transition"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch} className="flex relative">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-sm font-medium outline-none border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-brand-600 text-white text-xs font-bold rounded-lg"
            >
              Go
            </button>
          </form>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 dark:border-slate-800 space-y-2 animate-slide-up">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Home
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              My Orders
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Wishlist ({wishlistCount})
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;