import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
  fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const fetchData = async () => {
    try {
      const productRes = await axios.get("http://localhost:5000/api/products");

      const orderRes = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(productRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Dashboard data error");
    }
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length;
  const lowStock = products.filter((p) => Number(p.stock) <= 5).length;

  const customers = new Set(
    orders.map((o) => o.user?._id || o.user).filter(Boolean)
  ).size;

  const recentOrders = orders.slice(0, 5);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 p-8">
        {/* TOP HEADER */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 text-white shadow-xl">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-200">
                Admin Panel
              </p>
              <h1 className="text-4xl font-black tracking-tight">
                Dashboard Overview 🚀
              </h1>
              <p className="mt-2 text-slate-300">
                Track your store performance, orders and products.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate("/admin/products")}
                className="rounded-2xl bg-white px-5 py-3 font-bold text-slate-900 shadow hover:bg-blue-50"
              >
                Manage Products
              </button>

              <button
                onClick={() => navigate("/admin/orders")}
                className="rounded-2xl bg-blue-500 px-5 py-3 font-bold text-white shadow hover:bg-blue-600"
              >
                View Orders
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            icon="💰"
            color="from-green-500 to-emerald-600"
            sub="Total completed sales"
          />

          <StatCard
            title="Total Orders"
            value={orders.length}
            icon="📦"
            color="from-blue-500 to-cyan-600"
            sub={`${pendingOrders} pending orders`}
          />

          <StatCard
            title="Products"
            value={products.length}
            icon="🛍️"
            color="from-purple-500 to-indigo-600"
            sub={`${lowStock} low stock products`}
          />

          <StatCard
            title="Customers"
            value={customers}
            icon="👥"
            color="from-orange-500 to-red-500"
            sub="Unique customers"
          />
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* RECENT ORDERS */}
          <div className="xl:col-span-2 rounded-3xl bg-white p-6 shadow-lg">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Recent Orders
                </h2>
                <p className="text-sm text-slate-500">
                  Latest customer purchases
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/orders")}
                className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800"
              >
                View All
              </button>
            </div>

            {recentOrders.length === 0 ? (
              <div className="rounded-2xl bg-slate-100 p-8 text-center text-slate-500">
                No orders found
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 md:grid-cols-4 md:items-center"
                  >
                    <div>
                      <p className="font-black text-slate-900">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-slate-500">
                        {order.user?.name || "Customer"}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-800">
                        {order.items?.[0]?.product?.name || "Product"}
                      </p>
                      <p className="text-sm text-slate-500">
                        Items: {order.items?.length || 0}
                      </p>
                    </div>

                    <div>
                      <p className="font-black text-green-600">
                        ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <span className={getStatusClass(order.status)}>
                        {order.status || "Pending"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SIDE PANEL */}
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="text-2xl font-black text-slate-900">
              Store Summary
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              Quick performance status
            </p>

            <SummaryRow label="Delivered Orders" value={deliveredOrders} />
            <SummaryRow label="Pending Orders" value={pendingOrders} />
            <SummaryRow label="Low Stock" value={lowStock} />
            <SummaryRow label="Total Products" value={products.length} />

            <div className="mt-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <h3 className="text-xl font-black">Quick Action</h3>
              <p className="mt-2 text-sm text-blue-100">
                Add, edit or delete products from admin products page.
              </p>

              <button
                onClick={() => navigate("/admin/products")}
                className="mt-5 w-full rounded-2xl bg-white py-3 font-black text-blue-700 hover:bg-blue-50"
              >
                Go to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, icon, color, sub }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <h2 className="mt-3 text-3xl font-black text-slate-900">{value}</h2>
        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${color} text-3xl shadow-lg`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-500">{sub}</p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-100 p-4">
      <span className="font-bold text-slate-600">{label}</span>
      <span className="text-xl font-black text-slate-900">{value}</span>
    </div>
  );
}

function getStatusClass(status) {
  if (status === "Delivered") {
    return "rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700";
  }

  if (status === "Cancelled") {
    return "rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700";
  }

  return "rounded-full bg-yellow-100 px-4 py-2 text-sm font-black text-yellow-700";
}

export default AdminDashboard;