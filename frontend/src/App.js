import Register from "./pages/Register";
import Login from "./pages/Login";
import axios from "axios";
import ProductDetails from "./pages/ProductDetails";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import Wishlist from "./pages/Wishlist";
import Navbar from "./components/Navbar";

function HomePage() {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const searchKeyword = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(searchKeyword);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Default");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setSearch(searchKeyword);
  }, [searchKeyword]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

 


  const addToCart = async (e, productId) => {
    e.preventDefault();

    try {
      

      if (!token) {
        alert("Please login first");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added to cart 🛒");
    } catch (error) {
      console.log(error);
      alert("Failed to add product");
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const keyword = searchKeyword.toLowerCase();

      const matchSearch =
        product.name?.toLowerCase().includes(keyword) ||
        product.description?.toLowerCase().includes(keyword) ||
        product.category?.toLowerCase().includes(keyword);

      const matchCategory =
        category === "All" ||
        product.category?.toLowerCase() === category.toLowerCase();

      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sort === "LowToHigh") return a.price - b.price;
      if (sort === "HighToLow") return b.price - a.price;
      return 0;
    });

  return (
    <div className="bg-gray-100 min-h-screen">
    
      <Navbar />

      <div className="bg-white mt-2 px-12 py-6 flex justify-between shadow-sm">
        {[
          ["All", "🛍️"],
          ["Mobiles", "📱"],
          ["Laptops", "💻"],
          ["Fashion", "👟"],
          ["Electronics", "📺"],
          ["Furniture", "🛋️"],
          ["Watches", "⌚"],
        ].map(([cat, icon]) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex flex-col items-center hover:scale-110 transition ${
              category === cat ? "text-blue-600" : "text-gray-800"
            }`}
          >
            <span className="text-5xl">{icon}</span>
            <p className="font-semibold mt-2">{cat}</p>
          </button>
        ))}
      </div>

      <div className="mx-12 mt-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-16 flex items-center justify-between shadow-xl">
        <div>
          <h1 className="text-7xl font-black text-white leading-tight">
            BIG SAVING DAYS
          </h1>

          <p className="text-3xl text-blue-100 mt-6">
            Up To 70% OFF on Electronics 🔥
          </p>

          <button className="mt-10 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-10 py-4 rounded-2xl text-2xl shadow-lg">
            Shop Now
          </button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
          alt="banner"
          className="w-[430px] rounded-3xl shadow-2xl"
        />
      </div>

      <div className="px-12 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold">Trending Products 🔥</h2>
            <p className="text-gray-500 mt-2">
              Showing {filteredProducts.length} products
            </p>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-6 py-4 rounded-2xl border outline-none font-bold bg-white"
          >
            <option value="Default">Sort: Default</option>
            <option value="LowToHigh">Price: Low to High</option>
            <option value="HighToLow">Price: High to Low</option>
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow">
            <h2 className="text-3xl font-black">No products found</h2>
            <p className="text-gray-500 mt-2">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="bg-white rounded-3xl shadow-lg p-5 hover:scale-105 transition block"
              >
                <img
                  src={
                    product.image ||
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                  }
                  alt={product.name}
                  className="h-60 w-full object-cover rounded-2xl"
                />

                <h3 className="text-2xl font-bold mt-5">{product.name}</h3>

                <p className="text-gray-500 mt-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-5">
                  <span className="text-3xl font-bold text-green-600">
                    ₹{product.price}
                  </span>

                  <button
                    onClick={(e) => addToCart(e, product._id)}
                    className="bg-yellow-400 hover:bg-yellow-300 px-5 py-2 rounded-xl font-bold"
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/wishlist" element={<Wishlist />} />
    </Routes>
  );
}

export default App;