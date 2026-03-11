import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/users/${id}`,
          getAuthHeader(),
        );
        setUser(data);
      } catch (err) {
        toast.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const toggleStatus = async () => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/users/${id}/toggle`,
        {},
        getAuthHeader(),
      );

      setUser(data);
      toast.success("User status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const getStatusStyles = (user) =>
    user?.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse">Loading User...</div>
    );
  }

  if (!user) {
    return <p className="p-6">User not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-[#5e8741] font-medium"
      >
        ← Back
      </button>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-3xl font-bold text-gray-600">
          {user.name.charAt(0)}
        </div>

        <div>
          <h2 className="text-2xl font-semibold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>

          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusStyles(user)}`}
          >
            {user.isBlocked ? "Blocked" : "Active"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-500">Role</p>
          <p className="font-medium">{user.role}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded">
          <p className="text-gray-500">User ID</p>
          <p className="font-medium">#{user._id.slice(-6)}</p>
        </div>
      </div>

      <button
        onClick={toggleStatus}
        className="bg-[#5e8741] text-white px-6 py-2 rounded-md cursor-pointer"
      >
        {user.isBlocked ? "Unblock User" : "Block User"}
      </button>
    </div>
  );
};

export default UserDetails;
