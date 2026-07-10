import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);

  const fallbackImage =
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9";

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:5000/api/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart();
    } catch (error) {
      console.log(error);
    }
  };

  const getImage = (image) => {
    if (!image) return fallbackImage;

    if (typeof image === "string") {
      const cleanImage = image.trim();

      if (cleanImage.startsWith("http")) {
        return cleanImage;
      }
    }

    return fallbackImage;
  };

  const totalPrice =
    cart?.items?.reduce(
      (acc, item) => acc + (item.product?.price || 0) * item.quantity,
      0
    ) || 0;

  const totalItems =
    cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <>
      <Navbar />

      <div
        style={{
          backgroundColor: "#f1f3f6",
          minHeight: "100vh",
          padding: "30px",
        }}
      >
        <h1 style={{ marginBottom: "30px" }}>Shopping Cart</h1>

        {!cart || cart.items.length === 0 ? (
          <h2>Your cart is empty</h2>
        ) : (
          <div
            style={{
              display: "flex",
              gap: "30px",
              alignItems: "flex-start",
            }}
          >
            <div style={{ flex: 3 }}>
              {cart.items.map((item) => (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: "white",
                    padding: "20px",
                    marginBottom: "20px",
                    borderRadius: "12px",
                    display: "flex",
                    gap: "20px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={getImage(item.product?.image)}
                    alt={item.product?.name || "Product"}
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                    style={{
                      width: "180px",
                      height: "180px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h2>{item.product?.name}</h2>

                    <p style={{ color: "gray", marginBottom: "15px" }}>
                      {item.product?.description}
                    </p>

                    <h2 style={{ color: "#388e3c" }}>
                      ₹{item.product?.price}
                    </h2>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        marginTop: "20px",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            item.quantity > 1 ? item.quantity - 1 : 1
                          )
                        }
                        style={buttonStyle}
                      >
                        -
                      </button>

                      <h3>{item.quantity}</h3>

                      <button
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity + 1)
                        }
                        style={buttonStyle}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.product._id)}
                      style={{
                        marginTop: "20px",
                        backgroundColor: "#ff4d4f",
                        color: "white",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                flex: 1,
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                position: "sticky",
                top: "100px",
              }}
            >
              <h2>Price Details</h2>
              <hr />

              <div style={rowStyle}>
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>

              <div style={rowStyle}>
                <span>Total Price</span>
                <span style={{ fontWeight: "bold", color: "#388e3c" }}>
                  ₹{totalPrice}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                style={{
                  width: "100%",
                  backgroundColor: "#fb641b",
                  color: "white",
                  border: "none",
                  padding: "15px",
                  borderRadius: "10px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const buttonStyle = {
  backgroundColor: "#2874f0",
  color: "white",
  border: "none",
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: "bold",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  margin: "20px 0",
};

export default Cart;