import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import adminimg from "../assets/admin-img.png";

const AdminLogin = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });
      console.log("LOGIN RESPONSE:", data);

      // Ensure admin access
      if (data.role?.toLowerCase() !== "admin") {
        toast.error("Access denied. You are not an admin.");
        setLoading(false);
        return;
      }

      // Save admin token
      localStorage.setItem("token", data.token);

      // Save admin info (optional but useful)
      localStorage.setItem("adminInfo", JSON.stringify(data));

      toast.success(`Welcome back, ${data.name}!`);

      // Redirect to dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* LEFT FORM */}
        <form onSubmit={handleLogin} className="p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full mt-1 border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full mt-1 border rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-green-700 text-white py-2 rounded-md cursor-pointer hover:bg-green-800 transition disabled:bg-gray-400"
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        {/* RIGHT IMAGE */}
        <div className="hidden md:flex items-center justify-center bg-green-50">
          <img src={adminimg} alt="login" className="w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
