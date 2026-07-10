import axios from "axios";
import { useEffect, useState } from "react";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: "",
  });

  const emptyForm = {
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: "",
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (error) {
      console.log(error.response?.data || error);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const makeProductData = () => {
    return {
      name: form.name,
      price: Number(String(form.price).replace(/,/g, "")),
      description: form.description,
      category: form.category,
      stock: Number(String(form.stock).replace(/,/g, "")),
      image: form.image,
    };
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const productData = makeProductData();

      await axios.post("http://localhost:5000/api/products", productData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Product added");
      setForm(emptyForm);
      fetchProducts();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  const openEdit = (product) => {
    setEditProduct(product);

    setForm({
      name: product.name || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      stock: product.stock || "",
      image: product.image || "",
    });
  };

  const updateProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const productData = makeProductData();

      await axios.put(
        `http://localhost:5000/api/products/${editProduct._id}`,
        productData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Product updated");
      setEditProduct(null);
      setForm(emptyForm);
      fetchProducts();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "Failed to update product");
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Product deleted");
      fetchProducts();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-5xl font-black mb-8">Admin Products 🛍️</h1>

      <form
        onSubmit={addProduct}
        className="bg-white rounded-3xl shadow p-6 mb-8"
      >
        <h2 className="text-3xl font-black mb-5">Add Product</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="input"
            required
          />

          <input
            name="price"
            type="text"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="input"
            required
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="input"
            required
          />

          <input
            name="stock"
            type="text"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="input"
            required
          />

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="input md:col-span-2"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="input md:col-span-3"
            required
          />
        </div>

        <button className="mt-5 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">
          Add Product
        </button>
      </form>

      <div className="bg-white rounded-3xl shadow p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-4">Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="py-4">
                  <img
                    src={
                      p.image ||
                      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
                    }
                    alt={p.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                </td>

                <td className="font-bold">{p.name}</td>
                <td>{p.category}</td>
                <td>₹{Number(p.price).toLocaleString("en-IN")}</td>
                <td>{p.stock}</td>

                <td className="flex gap-3 py-5">
                  <button
                    onClick={() => openEdit(p)}
                    className="bg-yellow-400 px-4 py-2 rounded-xl font-bold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={updateProduct}
            className="bg-white rounded-3xl shadow-2xl p-8 w-[700px]"
          >
            <h2 className="text-3xl font-black mb-5">Edit Product</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input"
                required
              />

              <input
                name="price"
                type="text"
                value={form.price}
                onChange={handleChange}
                className="input"
                required
              />

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input"
                required
              />

              <input
                name="stock"
                type="text"
                value={form.stock}
                onChange={handleChange}
                className="input"
                required
              />

              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className="input col-span-2"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="input col-span-2"
                required
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setEditProduct(null);
                  setForm(emptyForm);
                }}
                className="bg-gray-200 px-6 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>

              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;