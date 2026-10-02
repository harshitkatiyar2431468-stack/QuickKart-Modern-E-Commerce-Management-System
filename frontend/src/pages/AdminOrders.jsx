import axios from "axios";
import { useEffect, useState } from "react";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data);
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order status updated");
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Status update failed");
    }
  };

  const statusClass = (status) => {
    const styles = {
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      Processing: "bg-blue-100 text-blue-700 border-blue-300",
      Shipped: "bg-purple-100 text-purple-700 border-purple-300",
      Delivered: "bg-green-100 text-green-700 border-green-300",
      Cancelled: "bg-red-100 text-red-700 border-red-300",
      Returned: "bg-gray-200 text-gray-700 border-gray-300",
    };

    return styles[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h1 className="text-3xl font-black">Loading Orders...</h1>
          <p className="text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-10 pt-28 pb-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-8 md:p-10 text-white shadow-xl mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-blue-200 font-bold uppercase tracking-widest">
                Admin Panel
              </p>
              <h1 className="text-4xl md:text-5xl font-black mt-2">
                Orders Management 📦
              </h1>
              <p className="text-blue-100 mt-3 text-lg">
                Manage customer orders, delivery status, returns and refunds.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
              <p className="text-blue-100 text-sm">Total Orders</p>
              <h2 className="text-4xl font-black">{orders.length}</h2>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow-md p-6 border">
            <p className="text-gray-500 font-bold">Total Revenue</p>
            <h2 className="text-4xl font-black text-green-600 mt-2">
              ₹{totalRevenue}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 border">
            <p className="text-gray-500 font-bold">Pending Orders</p>
            <h2 className="text-4xl font-black text-yellow-600 mt-2">
              {pendingOrders}
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-md p-6 border">
            <p className="text-gray-500 font-bold">Delivered Orders</p>
            <h2 className="text-4xl font-black text-blue-600 mt-2">
              {deliveredOrders}
            </h2>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-14 rounded-3xl shadow-md text-center border">
            <div className="text-7xl mb-5">🛒</div>
            <h2 className="text-3xl font-black">No Orders Found</h2>
            <p className="text-gray-500 mt-2">
              No customer orders available right now.
            </p>
          </div>
        ) : (
          <div className="space-y-7">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow-md border overflow-hidden"
              >
                {/* ORDER TOP */}
                <div className="bg-gray-50 border-b p-6">
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                    <div>
                      <p className="text-xs text-gray-500 font-black uppercase">
                        Order ID
                      </p>
                      <h2 className="font-black text-gray-900 break-all">
                        #{order._id}
                      </h2>

                      <div className="mt-3 text-gray-600 space-y-1">
                        <p>
                          <span className="font-bold text-gray-900">
                            Customer:
                          </span>{" "}
                          {order.user?.name || "Unknown User"}
                        </p>
                        <p>
                          <span className="font-bold text-gray-900">
                            Email:
                          </span>{" "}
                          {order.user?.email || "N/A"}
                        </p>
                        <p>
                          <span className="font-bold text-gray-900">
                            Date:
                          </span>{" "}
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <span
                        className={`px-5 py-2 rounded-full border font-black text-sm ${statusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus(order._id, e.target.value)
                        }
                        className="border px-5 py-3 rounded-xl font-bold bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Pending</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>
                        <option>Returned</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ADDRESS */}
                {order.shippingAddress && (
                  <div className="p-6 border-b">
                    <h3 className="text-xl font-black mb-2">
                      Delivery Address
                    </h3>

                    <p className="text-gray-600 leading-7">
                      {order.shippingAddress.fullName && (
                        <span className="font-bold text-gray-900">
                          {order.shippingAddress.fullName},{" "}
                        </span>
                      )}
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state} -{" "}
                      {order.shippingAddress.pincode}
                    </p>

                    {order.shippingAddress.phone && (
                      <p className="text-gray-600 mt-1">
                        Phone: {order.shippingAddress.phone}
                      </p>
                    )}
                  </div>
                )}

                {/* PRODUCTS */}
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-black">Ordered Products</h3>

                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col md:flex-row md:items-center gap-5 bg-gray-50 border rounded-2xl p-5"
                    >
                      <img
                        src={
                          item.product?.image ||
                          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                        }
                        alt={item.product?.name || "Product"}
                        className="w-24 h-24 rounded-xl object-cover border bg-white"
                      />

                      <div className="flex-1">
                        <h3 className="text-xl font-black text-gray-900">
                          {item.product?.name || "Product Removed"}
                        </h3>

                        <p className="text-gray-500 mt-1">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>

                      <p className="font-black text-green-600 text-xl">
                        ₹{item.quantity * item.price}
                      </p>v 
                    </div>
                  ))}
                </div>

                {/* FOOTER */}
                <div className="bg-gray-50 border-t p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
                      Payment: {order.paymentMethod || "Cash on Delivery"}
                    </span>

                    {order.returnStatus && (
                      <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                        Return: {order.returnStatus}
                      </span>
                    )}

                    {order.refundStatus && (
                      <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold">
                        Refund: {order.refundStatus}
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl font-black text-green-600">
                    Total: ₹{order.totalAmount}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;