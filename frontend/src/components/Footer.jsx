import React from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  Mail,
  ArrowRight,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 border-t border-slate-800/80">
      {/* VALUE PROPOSITIONS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-brand-600/10 text-brand-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Free Express Shipping</h4>
              <p className="text-xs text-slate-400 mt-1">
                Fast delivery on all prepaid orders over ₹499
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-emerald-600/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">100% Secure Checkout</h4>
              <p className="text-xs text-slate-400 mt-1">
                End-to-end encrypted 256-bit payment gateways
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-amber-600/10 text-amber-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">7-Day Easy Returns</h4>
              <p className="text-xs text-slate-400 mt-1">
                Hassle-free replacement & instant refund policy
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80">
            <div className="p-3 rounded-xl bg-purple-600/10 text-purple-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">24/7 Dedicated Support</h4>
              <p className="text-xs text-slate-400 mt-1">
                Live help desk for all order inquiries
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER LINKS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black">
                Q
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Quick<span className="text-brand-500">Kart</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your modern destination for premium electronics, trending fashion, smart mobiles and home essentials with lightning-fast delivery.
            </p>

            <div className="pt-2">
              <p className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Subscribe to Exclusive Deals
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing to QuickKart Newsletter!"); }} className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 transition"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">Home Store</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition">Track Orders</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition">Wishlist</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">Shopping Cart</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-brand-400 font-semibold transition">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Categories
            </h5>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/?category=Mobiles" className="hover:text-white transition">Mobiles & Tablets</Link>
              </li>
              <li>
                <Link to="/?category=Laptops" className="hover:text-white transition">Laptops & Computers</Link>
              </li>
              <li>
                <Link to="/?category=Fashion" className="hover:text-white transition">Fashion & Apparel</Link>
              </li>
              <li>
                <Link to="/?category=Electronics" className="hover:text-white transition">Electronics & Audio</Link>
              </li>
              <li>
                <Link to="/?category=Watches" className="hover:text-white transition">Smart Watches</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Project Info */}
          <div>
            <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4">
              Project Info
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>QuickKart E-Commerce Platform</strong>
              <br />
              Enterprise Full-Stack Major Project
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="text-white font-semibold">Tech Stack:</p>
              <p>• React 19 + Tailwind CSS</p>
              <p>• Node.js + Express REST API</p>
              <p>• MongoDB Database</p>
              <p>• JWT Authentication</p>
            </div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT BOTTOM BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p className="flex items-center gap-1">
          © {new Date().getFullYear()} QuickKart E-Commerce Management System. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          <span>•</span>
          <span className="hover:text-slate-400 cursor-pointer">Security</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
