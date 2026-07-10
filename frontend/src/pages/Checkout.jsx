import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCart(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load cart");
    }
  };

useEffect(() => {
  fetchCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const totalPrice =
    cart?.items?.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    ) || 0;

  const deliveryCharge = totalPrice > 999 ? 0 : 49;
  const finalAmount = totalPrice + deliveryCharge;

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      if (!cart?.items || cart.items.length === 0) {
        alert("Cart is empty");
        return;
      }

      if (
        !address.fullName ||
        !address.phone ||
        !address.street ||
        !address.city ||
        !address.state ||
        !address.pincode
      ) {
        alert("Please fill complete address");
        return;
      }

      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/orders/checkout",
        {
          shippingAddress: address,
          paymentMethod: "Cash on Delivery",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order placed successfully 🚀");
      navigate("/orders");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return (
      <h1 className="text-center mt-20 text-3xl font-bold">Loading...</h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <h1 className="text-4xl font-black mb-8">Checkout 🛒</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Delivery Address 📍</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input name="fullName" value={address.fullName} onChange={handleChange} placeholder="Full Name" className="bg-gray-100 p-4 rounded-xl outline-none" />
              <input name="phone" value={address.phone} onChange={handleChange} placeholder="Phone Number" className="bg-gray-100 p-4 rounded-xl outline-none" />
              <input name="street" value={address.street} onChange={handleChange} placeholder="House No, Street, Area" className="bg-gray-100 p-4 rounded-xl outline-none md:col-span-2" />
              <input name="city" value={address.city} onChange={handleChange} placeholder="City" className="bg-gray-100 p-4 rounded-xl outline-none" />
              <input name="state" value={address.state} onChange={handleChange} placeholder="State" className="bg-gray-100 p-4 rounded-xl outline-none" />
              <input name="pincode" value={address.pincode} onChange={handleChange} placeholder="Pincode" className="bg-gray-100 p-4 rounded-xl outline-none" />
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-5">Payment Method 💳</h2>

            <label className="flex items-center gap-3 border rounded-2xl p-4 cursor-pointer">
              <input type="radio" defaultChecked />
              <span className="font-semibold">Cash on Delivery</span>
            </label>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-5">Order Items 📦</h2>

            {cart.items.map((item) => (
              <div key={item.product._id} className="flex gap-5 border-b py-4">
                <img
                  src={
                    item.product.image ||
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                  }
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-2xl"
                />

                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.product.name}</h3>
                  <p className="text-gray-500">Qty: {item.quantity}</p>
                  <p className="text-green-600 font-bold">
                    ₹{item.product.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 h-fit sticky top-24">
          <h2 className="text-2xl font-black mb-6">Price Summary</h2>

          <div className="space-y-4 text-lg">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
            </div>

            <hr />

            <div className="flex justify-between text-2xl font-black">
              <span>Total</span>
              <span>₹{finalAmount}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="w-full mt-8 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 rounded-2xl font-bold text-xl shadow-lg transition"
          >
            {loading ? "Placing Order..." : "Place Order 🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;