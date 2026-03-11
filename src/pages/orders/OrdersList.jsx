import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const OrdersList = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/orders`,
          getAuthHeader(),
        );
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearch = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "All") {
      if (statusFilter === "Paid") {
        filtered = filtered.filter((order) => order.isPaid);
      }
      if (statusFilter === "Delivered") {
        filtered = filtered.filter((order) => order.isDelivered);
      }
      if (statusFilter === "Pending") {
        filtered = filtered.filter(
          (order) => !order.isDelivered && !order.isPaid,
        );
      }
    }

    setFilteredOrders(filtered);
  };

  const getStatusText = (order) => {
    if (order.isDelivered) return "Delivered";
    if (order.isPaid) return "Paid";
    return "Pending";
  };

  const getStatusStyle = (order) => {
    if (order.isDelivered) return "bg-green-100 text-green-700";
    if (order.isPaid) return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse">Loading Orders...</div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-xl md:text-2xl font-semibold">
        Orders ({filteredOrders.length})
      </h1>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-lg shadow space-y-3 lg:flex lg:gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2 w-full lg:w-40"
        >
          <option>All</option>
          <option>Paid</option>
          <option>Delivered</option>
          <option>Pending</option>
        </select>

        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-3 py-2 w-full lg:flex-1"
        />

        <button
          onClick={handleSearch}
          className="bg-[#5e8741] text-white px-4 py-2 rounded-md w-full lg:w-auto"
        >
          Search
        </button>
      </div>

      {/* MOBILE VIEW */}
      <div className="space-y-4 md:hidden">
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500 text-center">No orders found</p>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-4 rounded-lg shadow space-y-2"
            >
              <div className="flex justify-between">
                <span className="font-semibold">#{order._id.slice(-5)}</span>
                <span className="font-semibold">
                  ${order.totalPrice?.toFixed(2)}
                </span>
              </div>

              <div className="text-sm">{order.user?.name}</div>

              <div
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order)}`}
              >
                {getStatusText(order)}
              </div>

              <div className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>

              <Link
                to={`/admin/orders/${order._id}`}
                className="block bg-[#5e8741] text-white text-center py-2 rounded mt-3 hover:bg-green-700"
              >
                View Details
              </Link>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4">Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">#{order._id.slice(-5)}</td>

                  <td>{order.user?.name}</td>

                  <td>${order.totalPrice?.toFixed(2)}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order)}`}
                    >
                      {getStatusText(order)}
                    </span>
                  </td>

                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                  <td className="text-center">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="bg-[#5e8741] text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;
