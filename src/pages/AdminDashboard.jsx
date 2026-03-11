import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { ShoppingBag, DollarSign, Package, Users } from "lucide-react";

const AdminDashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartData = stats?.chartData || [
    { day: "Sun", orders: 0 },
    { day: "Mon", orders: 0 },
    { day: "Tue", orders: 0 },
    { day: "Wed", orders: 0 },
    { day: "Thu", orders: 0 },
    { day: "Fri", orders: 0 },
    { day: "Sat", orders: 0 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(`${API_URL}/api/orders/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats(data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse">Syncing dashboard...</div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* HEADER */}
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      {/* ===================== */}
      {/* DESKTOP LAYOUT */}
      {/* ===================== */}
      <div className="hidden md:block space-y-6">
        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<ShoppingBag size={18} />}
            label="Orders"
            value={stats?.totalOrders || 0}
          />
          <StatCard
            icon={<DollarSign size={18} />}
            label="Revenue"
            value={`$${stats?.totalRevenue?.toFixed(2) || "0.00"}`}
          />
          <StatCard
            icon={<Package size={18} />}
            label="Products"
            value={stats?.totalProducts || 0}
          />
          <StatCard
            icon={<Users size={18} />}
            label="Users"
            value={stats?.totalUsers || 0}
          />
        </div>

        {/* CHART */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Orders Overview</h2>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#5e8741" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>

              <tbody>
                {stats?.recentOrders?.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">
                        #{order._id.slice(-5)}
                      </td>
                      <td className="py-3 px-4">
                        {order.user?.name || "Guest"}
                      </td>
                      <td className="py-3 px-4">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.isDelivered
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.isDelivered ? "Delivered" : "Pending"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-gray-400">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ===================== */}
      {/* MOBILE LAYOUT */}
      {/* ===================== */}
      <div className="md:hidden space-y-4">
        {/* STAT CARDS STACKED */}
        <StatCard
          icon={<ShoppingBag size={18} />}
          label="Orders"
          value={stats?.totalOrders || 0}
        />
        <StatCard
          icon={<DollarSign size={18} />}
          label="Revenue"
          value={`$${stats?.totalRevenue?.toFixed(2) || "0.00"}`}
        />
        <StatCard
          icon={<Package size={18} />}
          label="Products"
          value={stats?.totalProducts || 0}
        />
        <StatCard
          icon={<Users size={18} />}
          label="Users"
          value={stats?.totalUsers || 0}
        />

        {/* SIMPLE CHART */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-base font-semibold mb-3">Weekly Orders</h2>

          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" />
                <Tooltip />
                <Bar dataKey="orders" fill="#5e8741" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ORDERS AS CARDS */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold">Recent Orders</h2>

          {stats?.recentOrders?.length > 0 ? (
            stats.recentOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow p-4 space-y-2"
              >
                <div className="flex justify-between">
                  <span className="font-semibold">#{order._id.slice(-5)}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-md font-medium ${
                      order.isDelivered
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : "Pending"}
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  {order.user?.name || "Guest"}
                </div>

                <div className="flex justify-between text-sm">
                  <span>${order.totalPrice?.toFixed(2)}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No recent orders found</p>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
    <div className="bg-green-100 text-[#5e8741] p-2 rounded-lg">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;
