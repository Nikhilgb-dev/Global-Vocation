import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import React, { useState } from "react";
import API from "../api/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", form);
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("auth-change"));
      const decoded: any = jwtDecode(data.token);

      console.log('decoded', decoded);

      toast.success("Login successful!");

      if (decoded.role === "company_admin") {
        localStorage.setItem("company_token", data.token);
        navigate("/company/dashboard");
      } else if (decoded.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-blue-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome Back</h2>
        <p className="text-gray-600 text-center mb-6">Sign in to continue</p>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-brand text-white py-2 rounded-md font-medium hover:bg-brand-dark transition"
        >
          Log In
        </button>

        <p className="mt-4 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-brand font-medium hover:underline">
            Create one
          </Link>
        </p>

        {/* <p className="mt-3 text-sm text-center text-gray-600">
          Are you a company?{" "}
          <Link to="/company/login" className="text-green-600 font-medium hover:underline">
            Login as a Company →
          </Link>
        </p> */}

      </form>
    </div>
  );
};

export default Login;
