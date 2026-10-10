import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X, ShoppingBag } from "lucide-react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border transform transition-all duration-300 animate-slide-up ${
              toast.type === "success"
                ? "bg-slate-900/95 text-white border-emerald-500/30 shadow-emerald-950/20"
                : toast.type === "cart"
                ? "bg-gradient-to-r from-brand-900 to-indigo-900 text-white border-brand-400/30 shadow-indigo-950/30"
                : toast.type === "error"
                ? "bg-red-950/95 text-white border-red-500/30 shadow-red-950/30"
                : "bg-slate-900/95 text-white border-slate-700"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {toast.type === "cart" && (
                <ShoppingBag className="w-5 h-5 text-brand-300 shrink-0" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              {toast.type === "info" && (
                <Info className="w-5 h-5 text-sky-400 shrink-0" />
              )}
              <span className="font-medium text-sm text-slate-100">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return { showToast: (msg) => console.log(msg) };
  }
  return context;
};
