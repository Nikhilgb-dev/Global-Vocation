import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

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
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full mb-2 p-2 border" />
      <button type="submit" className="bg-green-600 text-white w-full p-2">Login</button>
    </form>
  );
};

export default Login;
