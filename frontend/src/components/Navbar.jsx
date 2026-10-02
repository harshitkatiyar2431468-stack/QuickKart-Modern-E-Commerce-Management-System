import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [search, setSearch] = useState("");
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (token) {
      fetchWishlistCount();
      fetchCartCount();
    }
  }, [token]);

  const fetchWishlistCount = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistCount(res.data.products?.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartCount(res.data.items?.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const keyword = search.trim();

    if (!keyword) {
      navigate("/");
      return;
    }

    navigate(`/?search=${encodeURIComponent(keyword)}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">

        {/* QUICKKART LOGO */}
        <Link
          to="/"
          className="flex items-center shrink-0"
        >
          <img
            src="/quickkart-logo.png"
            alt="QuickKart"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className="flex-1 flex">
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 px-6 py-3 rounded-l-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-8 rounded-r-xl font-bold hover:bg-blue-700 transition"
          >
            Search
          </button>
        </form>

        {/* MENU */}
        <div className="flex items-center gap-6 text-gray-800 font-bold text-sm">

          <Link
            to="/"
            className="hover:text-blue-600 transition"
          >
            Home
          </Link>

          <Link
            to="/orders"
            className="hover:text-blue-600 transition"
          >
            Orders
          </Link>

          {/* WISHLIST */}
          <Link
            to="/wishlist"
            className="relative hover:text-red-500 transition whitespace-nowrap"
          >
            ❤️ Wishlist

            {wishlistCount > 0 && (
              <span className="absolute -top-3 -right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* CART */}
          <Link
            to="/cart"
            className="relative hover:text-blue-600 transition whitespace-nowrap"
          >
            🛒 Cart

            {cartCount > 0 && (
              <span className="absolute -top-3 -right-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            to="/admin"
            className="hover:text-blue-600 transition"
          >
            Admin
          </Link>

          {token ? (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-md transition"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl shadow-md transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;