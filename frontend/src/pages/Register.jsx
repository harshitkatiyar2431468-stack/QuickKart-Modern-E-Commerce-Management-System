import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      alert("Account Created Successfully 🚀");

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert("Registration Failed");

    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">

      {/* BACKGROUND BLUR */}
      <div className="absolute w-[500px] h-[500px] bg-pink-500 rounded-full blur-[180px] opacity-30 top-[-100px] left-[-100px]"></div>

      <div className="absolute w-[400px] h-[400px] bg-blue-500 rounded-full blur-[160px] opacity-30 bottom-[-100px] right-[-100px]"></div>

      {/* MAIN CARD */}
      <div className="w-[95%] max-w-6xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] overflow-hidden shadow-2xl grid md:grid-cols-2 z-10">

        {/* LEFT SIDE */}
        <div className="p-16 flex flex-col justify-center text-white relative">

          <h1 className="text-7xl font-black leading-tight">
            Join <br />
            QuickKart ⚡
          </h1>

          <p className="mt-8 text-xl text-gray-300 leading-10">

            Shop premium products, discover trending fashion,
            and experience next-level ecommerce vibes 🔥

          </p>

          {/* FEATURES */}
          <div className="mt-12 space-y-6">

            <div className="flex items-center gap-5">
              <span className="text-4xl">🚀</span>
              <p className="text-lg font-medium">
                Ultra Fast Delivery
              </p>
            </div>

            <div className="flex items-center gap-5">
              <span className="text-4xl">🔥</span>
              <p className="text-lg font-medium">
                Daily Crazy Deals
              </p>
            </div>

            <div className="flex items-center gap-5">
              <span className="text-4xl">💎</span>
              <p className="text-lg font-medium">
                Premium Shopping Experience
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="bg-white rounded-l-[40px] p-16 flex flex-col justify-center">

          <div className="mb-10">

            <h2 className="text-5xl font-black text-gray-900">
              Create Account ✨
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Start your shopping journey today
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={handleRegister}
            className="space-y-6"
          >

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full px-6 py-5 rounded-2xl bg-gray-100 outline-none border-2 border-transparent focus:border-pink-500 text-lg"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full px-6 py-5 rounded-2xl bg-gray-100 outline-none border-2 border-transparent focus:border-pink-500 text-lg"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-6 py-5 rounded-2xl bg-gray-100 outline-none border-2 border-transparent focus:border-pink-500 text-lg"
            />

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-5 rounded-2xl text-xl font-bold text-white bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 hover:scale-[1.02] transition duration-300 shadow-xl"
            >
              Create Account 🚀
            </button>

          </form>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-10">

            <div className="flex-1 h-[1px] bg-gray-300"></div>

            <p className="text-gray-400 font-semibold">
              OR
            </p>

            <div className="flex-1 h-[1px] bg-gray-300"></div>

          </div>

          {/* GOOGLE */}
          <button className="w-full py-4 rounded-2xl border border-gray-300 text-lg font-semibold hover:bg-gray-100 transition">

            Continue with Google

          </button>

          {/* LOGIN */}
          <p className="text-center text-gray-500 mt-10 text-lg">

            Already have an account?

            <span
              onClick={() => navigate("/login")}
              className="text-pink-500 font-bold ml-2 cursor-pointer hover:underline"
            >
              Login
            </span>

          </p>

        </div>

      </div>

    </div>

  );
}

export default Register;