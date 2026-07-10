import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fallbackImage =
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.log(error);
        alert("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return false;
      }

      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Added to cart 🛒");
      return true;
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to add");
      return false;
    }
  };
const addToWishlist = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    await axios.post(
      "http://localhost:5000/api/wishlist/add",
      {
        productId: product._id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Added to Wishlist ❤️");
  } catch (error) {
    console.log(error);
    alert(
      error.response?.data?.message ||
      "Failed to add wishlist"
    );
  }
};
  const buyNow = async () => {
    const added = await addToCart();
    if (added) navigate("/cart");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-[#f1f3f6]">
          <h1 className="text-3xl font-bold text-gray-700">Loading...</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#f1f3f6] px-4 py-5">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[42%_58%]">
          {/* LEFT IMAGE SECTION */}
          <div className="rounded-sm bg-white p-4 shadow-sm">
            <div className="flex min-h-[470px] items-center justify-center border border-gray-100">
              <img
                src={product?.image || fallbackImage}
                alt={product?.name}
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
                className="max-h-[420px] w-full object-contain p-6"
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                onClick={addToCart}
                className="bg-[#ff9f00] py-4 text-lg font-bold text-white hover:bg-[#f39a00]"
              >
                🛒 ADD TO CART
              </button>

              <button
                onClick={buyNow}
                className="bg-[#fb641b] py-4 text-lg font-bold text-white hover:bg-[#e85d17]"
              >
                ⚡ BUY NOW
              </button>
              <button
  onClick={addToWishlist}
  className="bg-pink-500 py-4 text-lg font-bold text-white hover:bg-pink-600"
>
  ❤️ WISHLIST
</button>
            </div>
          </div>

          {/* RIGHT DETAILS SECTION */}
          <div className="rounded-sm bg-white p-6 shadow-sm">
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-sm font-semibold text-[#2874f0]"
            >
              ← Back
            </button>

            <h1 className="text-2xl font-semibold leading-8 text-[#212121]">
              {product?.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <span className="rounded bg-[#388e3c] px-2 py-1 text-sm font-bold text-white">
                4.3 ★
              </span>
              <span className="text-sm font-semibold text-gray-500">
                12,345 Ratings & 1,234 Reviews
              </span>
            </div>

            <p className="mt-4 text-sm font-bold text-[#388e3c]">
              Special price
            </p>

            <div className="mt-2 flex items-end gap-3">
              <h2 className="text-4xl font-semibold text-[#212121]">
                ₹{Number(product?.price || 0).toLocaleString("en-IN")}
              </h2>

              <span className="pb-1 text-lg text-gray-400 line-through">
                ₹{Number((product?.price || 0) * 1.25).toLocaleString("en-IN")}
              </span>

              <span className="pb-1 text-lg font-bold text-[#388e3c]">
                20% off
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-600">
              + ₹0 delivery charges
            </p>

            <div className="mt-6">
              <h3 className="mb-3 text-lg font-bold text-[#212121]">
                Available offers
              </h3>

              <Offer text="Bank Offer 10% instant discount on selected bank cards" />
              <Offer text="Special Price Get extra discount on this product" />
              <Offer text="Free delivery on orders above ₹499" />
              <Offer text="No Cost EMI available on selected cards" />
            </div>

            <div className="mt-6 border-t pt-5">
              <div className="grid grid-cols-[120px_1fr] gap-4">
                <p className="font-bold text-gray-500">Delivery</p>
                <div>
                  <p className="font-semibold text-[#212121]">
                    Delivery by Tomorrow
                  </p>
                  <p className="text-sm text-gray-500">
                    If ordered before 11 PM
                  </p>
                </div>

                <p className="font-bold text-gray-500">Category</p>
                <p className="font-semibold text-[#212121]">
                  {product?.category || "Product"}
                </p>

                <p className="font-bold text-gray-500">Stock</p>
                <p className="font-semibold text-[#388e3c]">
                  {product?.stock ?? 0} available
                </p>

                <p className="font-bold text-gray-500">Warranty</p>
                <p className="font-semibold text-[#212121]">
                  7 Days Replacement Policy
                </p>
              </div>
            </div>

            <div className="mt-6 border-t pt-5">
              <h3 className="mb-3 text-lg font-bold text-[#212121]">
                Product Description
              </h3>
              <p className="leading-8 text-gray-600">
                {product?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Offer({ text }) {
  return (
    <div className="mb-3 flex gap-3 text-sm">
      <span className="text-[#388e3c]">🏷️</span>
      <p className="font-semibold text-gray-700">{text}</p>
    </div>
  );
}

export default ProductDetails;