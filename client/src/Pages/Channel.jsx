import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // Save token
      localStorage.setItem(
        "token",
        response.data.token
      );

      // Save user
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert(response.data.message);

      navigate("/");
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl p-8 border border-zinc-800 shadow-2xl">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
            alt="youtube"
            className="w-36"
          />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Welcome Back
        </h1>

        <p className="text-zinc-400 text-center mb-8">
          Login to continue
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* EMAIL */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">
              Email
            </label>

            <div className="flex items-center bg-zinc-800 rounded-xl px-4 border border-zinc-700 focus-within:border-red-500">
              <Mail className="text-zinc-400 w-5 h-5" />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent px-3 py-3 text-white outline-none"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm text-zinc-300 mb-2 block">
              Password
            </label>

            <div className="flex items-center bg-zinc-800 rounded-xl px-4 border border-zinc-700 focus-within:border-red-500">
              <Lock className="text-zinc-400 w-5 h-5" />

              <input
                type={
                  showPassword ? "text" : "password"
                }
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent px-3 py-3 text-white outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <EyeOff className="text-zinc-400 w-5 h-5" />
                ) : (
                  <Eye className="text-zinc-400 w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 transition text-white font-semibold py-3 rounded-xl"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        {/* REGISTER LINK */}
        <p className="text-zinc-400 text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-red-500 hover:text-red-400 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;