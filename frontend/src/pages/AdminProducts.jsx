import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useToast } from "../context/ToastContext";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  ArrowLeft,
  X,
  Check,
} from "lucide-react";

function AdminProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const initialFormState = {
    name: "",
    price: "",
    category: "Mobiles",
    stock: "",
    image: "",
    description: "",
  };

  const [form, setForm] = useState(initialFormState);

  const fallbackImage =
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop";

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      showToast("Failed to fetch product list", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm(initialFormState);
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name || "",
      price: p.price || "",
      category: p.category || "Mobiles",
      stock: p.stock || "",
      image: p.image || "",
      description: p.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productPayload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock),
      image: form.image.trim(),
      description: form.description.trim(),
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, productPayload);
        showToast("Product updated successfully! ✨", "success");
      } else {
        await api.post("/products", productPayload);
        showToast("New product listed successfully! 🛍️", "success");
      }

      setShowModal(false);
      setForm(initialFormState);
      fetchProducts();
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Failed to save product", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      showToast("Product deleted from catalog", "info");
      fetchProducts();
    } catch (error) {
      console.error(error);
      showToast("Failed to delete product", "error");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="p-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white">
                  Products Management
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Create, edit, and control inventory for your store.
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenAdd}
              className="btn-primary text-xs px-6 py-3.5 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-4 mb-6 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 pl-1" />
            <input
              type="text"
              placeholder="Search products by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm font-medium outline-none text-slate-800 dark:text-white placeholder-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2"
              >
                Clear
              </button>
            )}
          </div>

          {/* Product Table Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 skeleton-box rounded-xl" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                No products found matching "{search}".
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Price</th>
                      <th className="py-4 px-4">Stock</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={product.image || fallbackImage}
                              alt={product.name}
                              onError={(e) => {
                                e.currentTarget.src = fallbackImage;
                              }}
                              className="w-12 h-12 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 border dark:border-slate-700 p-1 shrink-0"
                            />
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-slate-900 dark:text-white truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-slate-400 line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {product.category || "General"}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              product.stock <= 5
                                ? "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300/30"
                                : "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300/30"
                            }`}
                          >
                            {product.stock || 0} Units
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="p-2 rounded-xl text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/80 transition"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="p-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/80 transition"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ADD / EDIT PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <div>
                <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Fill in the product specifications to update your store catalog
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Apple iPhone 15 Pro Max"
                  required
                  className="input-premium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="e.g. 79999"
                    required
                    min="1"
                    className="input-premium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="input-premium cursor-pointer"
                  >
                    <option value="Mobiles" className="dark:bg-slate-900">Mobiles</option>
                    <option value="Laptops" className="dark:bg-slate-900">Laptops</option>
                    <option value="Fashion" className="dark:bg-slate-900">Fashion</option>
                    <option value="Electronics" className="dark:bg-slate-900">Electronics</option>
                    <option value="Furniture" className="dark:bg-slate-900">Furniture</option>
                    <option value="Watches" className="dark:bg-slate-900">Watches</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="e.g. 25"
                    required
                    min="0"
                    className="input-premium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Image URL (Unsplash or Direct Link)
                </label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="input-premium"
                />
                {form.image && (
                  <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-12 h-12 object-contain rounded-lg border dark:border-slate-700 bg-white"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Live Image Preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Product Description *
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Key features, specifications, and details..."
                  required
                  className="input-premium"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary text-xs px-5 py-3"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs px-6 py-3">
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? "Save Changes" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default AdminProducts;