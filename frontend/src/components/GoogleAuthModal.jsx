import React, { useState } from "react";
import api from "../api";
import { useShop } from "../context/ShopContext";
import { useToast } from "../context/ToastContext";
import { useNavigate } from "react-router-dom";
import { X, ArrowRight, UserPlus, ShieldCheck } from "lucide-react";

function GoogleAuthModal({ isOpen, onClose, mode = "login" }) {
  const navigate = useNavigate();
  const { saveAuth } = useShop();
  const { showToast } = useToast();

  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSelect = async (account) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/google", {
        email: account.email,
        name: account.name,
        avatar: account.avatar,
        googleId: account.googleId || `g_${Date.now()}`,
      });

      saveAuth(res.data.token, res.data.user);
      showToast(
        `Welcome ${account.name}! Signed in via Google 🚀`,
        "success"
      );
      onClose();
      navigate("/");
    } catch (error) {
      console.error(error);
      showToast(
        error.response?.data?.message || "Google authentication failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail) return;
    const name = customName.trim() || customEmail.split("@")[0];
    handleGoogleSelect({
      email: customEmail.trim(),
      name,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      googleId: `custom_google_${Date.now()}`,
    });
  };

  const predefinedAccounts = [
    {
      name: "Harshit Katiyar",
      email: "harshit.katiyar@gmail.com",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop",
    },
    {
      name: "Alex Johnson",
      email: "alex.johnson.dev@gmail.com",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=120&auto=format&fit=crop",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 sm:p-8 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            {/* Google G Logo */}
            <svg className="w-6 h-6" viewBox="0 0 24 24">
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
            <div>
              <h3 className="font-heading font-black text-slate-900 dark:text-white text-base">
                {mode === "register" ? "Sign up with Google" : "Sign in with Google"}
              </h3>
              <p className="text-[11px] text-slate-400">to continue to QuickKart</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Account Selector */}
        <div className="py-5 space-y-3">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Choose a Google account:
          </p>

          <div className="space-y-2">
            {predefinedAccounts.map((acc) => (
              <button
                key={acc.email}
                disabled={loading}
                onClick={() => handleGoogleSelect(acc)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                      {acc.name}
                    </p>
                    <p className="text-xs text-slate-400">{acc.email}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition" />
              </button>
            ))}
          </div>

          {/* Toggle Custom Google Email Input */}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/60 transition border border-dashed border-brand-300 dark:border-brand-800"
            >
              <UserPlus className="w-4 h-4" />
              <span>Use another Google account</span>
            </button>
          ) : (
            <form
              onSubmit={handleCustomSubmit}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 mt-2"
            >
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Enter your Google Account details:
              </p>
              <input
                type="text"
                placeholder="Your Full Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="input-premium text-xs py-2.5"
                required
              />
              <input
                type="email"
                placeholder="Google Email (e.g. name@gmail.com)"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="input-premium text-xs py-2.5"
                required
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow"
                >
                  {loading ? "Authenticating..." : "Authorize"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Verified Google OAuth 2.0
          </span>
          <span>QuickKart Secure Login</span>
        </div>
      </div>
    </div>
  );
}

export default GoogleAuthModal;
