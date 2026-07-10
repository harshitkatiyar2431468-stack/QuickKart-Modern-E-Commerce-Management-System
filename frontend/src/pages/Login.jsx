import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem(
        "token",
        res.data.token
      );
      
    localStorage.setItem("token", res.data.token);

      alert("Login Successful 🔥");

      navigate("/");

    } catch (error) {
      console.log(error);

      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-6">

      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 p-16 text-white flex flex-col justify-center relative overflow-hidden">

          {/* Blur Circle */}
          <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-white/10 rounded-full"></div>

          <div className="absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-white/10 rounded-full"></div>

          <div className="relative z-10">

            <h1 className="text-6xl font-black tracking-wide">
              QuickKart
            </h1>

            <p className="mt-8 text-2xl font-light leading-10 text-blue-100">
              Shop smarter with premium brands,
              exclusive offers and lightning-fast delivery 🚀
            </p>

            {/* FEATURES */}
            <div className="mt-12 space-y-5">

              <div className="flex items-center gap-4">
                <span className="text-3xl">⚡</span>
                <p className="text-lg">
                  Fast Delivery Across India
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl">🛒</span>
                <p className="text-lg">
                  Millions of Trending Products
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-3xl">🔒</span>
                <p className="text-lg">
                  100% Secure Payments
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="p-16 flex flex-col justify-center">

          <div className="mb-10">

            <h2 className="text-5xl font-black text-gray-800">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Login to continue shopping with QuickKart
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-6"
          >

            {/* EMAIL */}
            <div>

              <label className="block text-gray-700 font-semibold mb-3">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                className="w-full border border-gray-300 px-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />

            </div>

            {/* PASSWORD */}
            <div>

              <label className="block text-gray-700 font-semibold mb-3">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                onChange={handleChange}
                className="w-full border border-gray-300 px-5 py-4 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition"
              />

            </div>

            {/* FORGOT PASSWORD */}
            <div className="flex justify-end">

              <button
                type="button"
                className="text-blue-600 font-semibold hover:underline"
              >
                Forgot Password?
              </button>

            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-[1.02] text-white py-4 rounded-2xl text-xl font-bold shadow-lg transition duration-300"
            >
              Login
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-10">

            <div className="flex-1 h-[1px] bg-gray-300"></div>

            <p className="text-gray-400 font-medium">
              OR
            </p>

            <div className="flex-1 h-[1px] bg-gray-300"></div>

          </div>

          {/* GOOGLE BUTTON */}
          <button className="w-full border border-gray-300 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition">

            Continue with Google

          </button>

          {/* REGISTER */}
          <p className="text-center text-gray-500 mt-10 text-lg">

            Don’t have an account?

            <span 
            onClick={() => navigate("/register")}
            className="text-blue-600 font-bold ml-2 cursor-pointer hover:underline">
              Register
            </span>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;