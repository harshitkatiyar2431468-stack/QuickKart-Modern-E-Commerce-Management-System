import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useShop } from "../context/ShopContext";
import { useToast } from "../context/ToastContext";
import {
  TrendingUp,
  Package,
  ShoppingBag,
  Users,
  ShieldCheck,
  AlertTriangle,
  Plus,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();
  const { token } = useShop();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) {
      showToast("Admin access requires authentication", "error");
      navigate("/login");
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const [prodRes, orderRes] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
      ]);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to load admin analytics", "error");
    }
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const lowStockProducts = products.filter((p) => Number(p.stock) <= 5);

  const uniqueCustomers = new Set(
    orders.map((o) => o.user?._id || o.user).filter(Boolean)
  ).size;

  const recentOrders = orders.slice(0, 6);

  const getStatusClass = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
      case "Shipped":
        return "bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "Processing":
        return "bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "Cancelled":
        return "bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      default:
        return "bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* HEADER BANNER */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-10 text-white shadow-xl mb-8 border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Administrator Portal
                </div>
                <h1 className="text-3xl sm:text-4xl font-heading font-black text-white">
                  Executive Dashboard 🚀
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Real-time analytics, order fulfilment, and inventory management.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/admin/products"
                  className="px-5 py-3 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs flex items-center gap-2 transition shadow-md border border-transparent dark:border-slate-700"
                >
                  <ShoppingBag className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Manage Products ({products.length})</span>
                </Link>

                <Link
                  to="/admin/orders"
                  className="px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md shadow-brand-500/20"
                >
                  <Package className="w-4 h-4" />
                  <span>Orders Console ({orders.length})</span>
                </Link>
              </div>
            </div>
          </div>

          {/* METRIC STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Gross Revenue
                </span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  ₹
                </div>
              </div>
              <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white mt-3">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Across all processed orders</span>
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Orders
                </span>
                <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white mt-3">
                {orders.length}
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-2">
                {pendingOrders} Pending Action
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Active Products
                </span>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white mt-3">
                {products.length}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
                {lowStockProducts.length} low stock items
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Customers
                </span>
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-3xl font-heading font-black text-slate-900 dark:text-white mt-3">
                {uniqueCustomers || (orders.length > 0 ? 1 : 0)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2">
                Unique purchasing accounts
              </p>
            </div>
          </div>

          {/* MAIN PANELS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* RECENT ORDERS TABLE */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-heading font-black text-slate-900 dark:text-white">
                    Recent Customer Orders
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Latest orders placed across the store</p>
                </div>
                <Link
                  to="/admin/orders"
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline bg-brand-50 dark:bg-brand-950 px-3.5 py-1.5 rounded-xl transition"
                >
                  View All Orders →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  No orders recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {recentOrders.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                          <td className="py-3.5 font-bold text-slate-900 dark:text-white text-xs">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>
                          <td className="py-3.5 text-xs text-slate-700 dark:text-slate-300">
                            {order.user?.name || "Customer"}
                          </td>
                          <td className="py-3.5 font-extrabold text-slate-900 dark:text-white text-xs">
                            ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                          </td>
                          <td className="py-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusClass(
                                order.status
                              )}`}
                            >
                              {order.status || "Pending"}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <Link
                              to="/admin/orders"
                              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                            >
                              Manage
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* SIDE PANEL */}
            <div className="lg:col-span-4 space-y-6">
              {/* Low Stock Box */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Low Stock Warnings ({lowStockProducts.length})</span>
                </div>

                {lowStockProducts.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    All products are adequately stocked!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.slice(0, 4).map((p) => (
                      <div
                        key={p._id}
                        className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                            Only {p.stock} left in stock
                          </span>
                        </div>
                        <Link
                          to="/admin/products"
                          className="shrink-0 text-[10px] font-bold bg-amber-200/60 dark:bg-amber-900/60 hover:bg-amber-300 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-200 px-2.5 py-1 rounded-lg transition"
                        >
                          Restock
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Action CTA Card */}
              <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-700 p-6 text-white shadow-lg shadow-brand-500/20 space-y-3">
                <h4 className="text-lg font-heading font-black text-white">
                  Add New Product
                </h4>
                <p className="text-xs text-brand-100 leading-relaxed">
                  List fresh inventory, update pricing and upload high-res images to your live catalog.
                </p>
                <Link
                  to="/admin/products"
                  className="btn-accent text-xs px-5 py-3 w-full mt-2 font-black"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product Now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default AdminDashboard;