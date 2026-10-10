import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { useShop } from "../context/ShopContext";
import { useToast } from "../context/ToastContext";
import GoogleAuthModal from "../components/GoogleAuthModal";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { saveAuth } = useShop();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/login", formData);
      saveAuth(
        res.data.token,
        res.data.user || {
          email: formData.email,
          name: formData.email.split("@")[0],
        }
      );
      showToast("Welcome back! Login Successful 🚀", "success");
      navigate("/");
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.message || "Invalid email or password",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (role) => {
    if (role === "admin") {
      setFormData({ email: "admin@quickkart.com", password: "adminpassword" });
    } else {
      setFormData({ email: "user@quickkart.com", password: "password123" });
    }
    showToast(`Filled demo ${role} credentials!`, "info");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 backdrop-blur-2xl rounded-3xl sm:rounded-[32px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 z-10">
        {/* LEFT COLUMN: HERO BRANDING */}
        <div className="lg:col-span-5 bg-gradient-to-br from-brand-900/90 via-indigo-950 to-slate-950 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                Q
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Quick<span className="text-brand-400">Kart</span>
              </span>
            </Link>

            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white leading-tight">
              Experience <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-indigo-200 to-amber-300">
                Next-Gen Commerce.
              </span>
            </h2>

            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              Login to access personalized product recommendations, real-time tracking, and exclusive members-only deals.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Encrypted & Secure Authentication</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Instant 1-Click Checkout Activated</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM */}
        <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-slate-900/40">
          <div className="mb-6">
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Welcome Back 👋
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Enter your credentials or continue with Google
            </p>
          </div>

          {/* GOOGLE SIGN IN BUTTON */}
          <button
            type="button"
            onClick={() => setGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm shadow-md transition duration-200 mb-5 active:scale-98 border border-slate-200"
          >
            {/* Google SVG Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* OR DIVIDER */}
          <div className="flex items-center gap-4 my-2 mb-5">
            <div className="flex-1 h-[1px] bg-slate-800" />
            <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
              Or sign in with email
            </span>
            <div className="flex-1 h-[1px] bg-slate-800" />
          </div>

          {/* Quick Demo Credentials */}
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 mb-5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick Autofill:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo("user")}
                className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold transition"
              >
                Demo User
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo("admin")}
                className="px-2.5 py-1 rounded-lg bg-brand-600/80 hover:bg-brand-600 text-white font-bold transition"
              >
                Demo Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/80 border border-slate-700 focus:border-brand-500 rounded-2xl text-white text-sm outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-slate-800/80 border border-slate-700 focus:border-brand-500 rounded-2xl text-white text-sm outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-lg shadow-brand-500/25 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to QuickKart</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-brand-400 font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Google Sign-in Modal */}
      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        mode="login"
      />
    </div>
  );
}

export default Login;