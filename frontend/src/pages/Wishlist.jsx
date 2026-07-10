import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Wishlist() {
  const [products, setProducts] = useState([]);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts(res.data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/wishlist/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchWishlist();
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/cart/add",
        {
          productId,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Added to Cart 🛒");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-6 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
            <h1 className="text-5xl font-black text-gray-900">
              My Wishlist ❤️
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              {products.length} saved item(s)
            </p>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-20 text-center">
              <div className="text-8xl mb-5">💔</div>

              <h2 className="text-3xl font-bold">
                Your Wishlist is Empty
              </h2>

              <p className="text-gray-500 mt-3">
                Save your favourite products here.
              </p>

              <Link
                to="/"
                className="inline-block mt-6 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300 hover:-translate-y-2"
                >
                  <Link to={`/product/${product._id}`}>
                    <div className="bg-gray-50 h-64 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-52 object-contain"
                      />
                    </div>
                  </Link>

                  <div className="p-5">
                    <h2 className="font-bold text-xl line-clamp-2 min-h-[60px]">
                      {product.name}
                    </h2>

                    <p className="text-green-600 text-2xl font-black mt-3">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>

                    <div className="flex flex-col gap-3 mt-5">
                      <button
                        onClick={() => addToCart(product._id)}
                        className="bg-yellow-400 hover:bg-yellow-500 py-3 rounded-xl font-bold"
                      >
                        🛒 Move To Cart
                      </button>

                      <Link
                        to={`/product/${product._id}`}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-center"
                      >
                        View Product
                      </Link>

                      <button
                        onClick={() => removeWishlist(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold"
                      >
                        Remove ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Wishlist;