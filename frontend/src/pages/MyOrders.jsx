import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  const returnOrder = async (orderId) => {
    const reason = prompt("Return reason likho:");

    if (!reason) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/return`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Return request submitted");
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Return failed");
    }
  };

  const statusStyle = (status) => {
    const styles = {
      Pending: "bg-yellow-50 text-yellow-700 border-yellow-300",
      Processing: "bg-blue-50 text-blue-700 border-blue-300",
      Shipped: "bg-purple-50 text-purple-700 border-purple-300",
      Delivered: "bg-green-50 text-green-700 border-green-300",
      Cancelled: "bg-red-50 text-red-700 border-red-300",
      Returned: "bg-gray-100 text-gray-700 border-gray-300",
    };

    return styles[status] || "bg-gray-100 text-gray-700 border-gray-300";
  };
const getProgress = (status) => {
  switch (status) {
    case "Pending":
      return 25;

    case "Processing":
      return 50;

    case "Shipped":
      return 75;

    case "Delivered":
      return 100;

    default:
      return 0;
  }
};
  const steps = [
  {
    name: "Pending",
    icon: "📝",
  },
  {
    name: "Processing",
    icon: "⚙️",
  },
  {
    name: "Shipped",
    icon: "🚚",
  },
  {
    name: "Delivered",
    icon: "📦",
  },
];

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
        <div className="bg-white px-10 py-8 rounded-3xl shadow-xl text-center">
          <div className="text-5xl mb-4">📦</div>
          <h1 className="text-3xl font-black">Loading Orders...</h1>
          <p className="text-gray-500 mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 md:px-10 py-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-md p-6 md:p-8 mb-8 border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900">
                My Orders
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                Track your orders, cancel pending orders and request returns.
              </p>
            </div>

            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-bold text-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-14 text-center border">
            <div className="text-7xl mb-5">🛒</div>
            <h2 className="text-4xl font-black text-gray-900">
              No Orders Found
            </h2>
            <p className="text-gray-500 mt-3 text-lg">
              You have not placed any order yet.
            </p>

            <Link
              to="/"
              className="inline-block mt-8 bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentIndex = steps.findIndex(
  (s) => s.name === order.status
);

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl shadow-md border overflow-hidden"
                >
                  {/* ORDER HEADER */}
                  <div className="bg-gray-50 px-6 py-5 border-b">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase">
                          Order ID
                        </p>
                        <h2 className="text-gray-900 font-black break-all">
                          #{order._id}
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm">
                          Ordered on: {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`px-5 py-2 rounded-full border text-sm font-black ${statusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                        <div className="text-2xl font-black text-gray-900">
                          ₹{order.totalAmount}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS TIMELINE */}
                  {order.status !== "Cancelled" &&
                    order.status !== "Returned" && (
                      <div className="px-6 py-5 border-b">
                        <div className="space-y-5">

  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
    <div
      className="bg-blue-600 h-3 rounded-full transition-all duration-700"
      style={{
        width: `${getProgress(order.status)}%`,
      }}
    />
  </div>

  <div className="grid grid-cols-4 gap-3">
{steps.map((step, index) => (
  <div key={step.name} className="text-center">

    <div
      className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl ${
        index <= currentIndex
          ? "bg-blue-600 text-white"
          : "bg-gray-300"
      }`}
    >
      {step.icon}
    </div>

    <p
      className={`mt-2 text-sm font-bold ${
        index <= currentIndex
          ? "text-blue-700"
          : "text-gray-400"
      }`}
    >
      {step.name}
    </p>

  </div>
))}
  </div>

</div>
                      </div>
                    )}

                  {/* SHIPPING */}
                  {order.shippingAddress && (
                    <div className="px-6 py-5 border-b bg-white">
                      <h3 className="text-lg font-black mb-2">
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
                  {order.status !== "Delivered" && (
  <div className="px-6 py-4 bg-blue-50 border-b">

    <h3 className="font-bold text-blue-700">
      🚚 Estimated Delivery
    </h3>

    <p className="text-gray-700 mt-1">
      Expected within 3-5 business days
    </p>

  </div>
)}
                  {/* PRODUCTS */}
                  <div className="p-6 space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex flex-col md:flex-row md:items-center gap-5 bg-gray-50 rounded-2xl p-5 border"
                      >
                        <img
                          src={
                            item.product?.image ||
                            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                          }
                          alt={item.product?.name || "Product"}
                          className="w-28 h-28 rounded-xl object-cover bg-white border"
                        />

                        <div className="flex-1">
                          <h3 className="text-2xl font-black text-gray-900">
                            {item.product?.name || "Product Removed"}
                          </h3>

                          <p className="text-gray-500 mt-1">
                            Qty: {item.quantity}
                          </p>

                          <p className="text-green-700 font-black mt-1">
                            ₹{item.price}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {item.product?._id && (
                            <Link
                              to={`/product/${item.product._id}`}
                              className="px-5 py-3 rounded-xl bg-white border font-bold hover:bg-gray-100"
                            >
                              View Product
                            </Link>
                          )}

                          {order.status === "Pending" && (
                            <button
                              onClick={() => cancelOrder(order._id)}
                              className="px-5 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600"
                            >
                              Cancel
                            </button>
                          )}

                          {order.status === "Delivered" && (
                            <button
                              onClick={() => returnOrder(order._id)}
                              className="px-5 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-black"
                            >
                              Return
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}
                  <div className="px-6 py-5 bg-gray-50 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <p className="text-gray-500 font-semibold">
                      Payment Method:{" "}
                      <span className="text-gray-900 font-black">
                        {order.paymentMethod || "Cash on Delivery"}
                      </span>
                    </p>

                    <p className="text-gray-900 font-black text-xl">
                      Total: ₹{order.totalAmount}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;