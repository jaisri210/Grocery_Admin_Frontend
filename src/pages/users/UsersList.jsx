import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UsersList = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/users`,
          getAuthHeader(),
        );
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = () => {
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()),
    );
    setFilteredUsers(filtered);
  };

  const toggleStatus = async (id) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/users/${id}/toggle`,
        {},
        getAuthHeader(),
      );

      setUsers((prev) => prev.map((u) => (u._id === id ? data : u)));
      setFilteredUsers((prev) => prev.map((u) => (u._id === id ? data : u)));

      toast.success("User status updated");
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      await axios.delete(`${API_URL}/api/users/${id}`, getAuthHeader());

      setUsers((prev) => prev.filter((u) => u._id !== id));
      setFilteredUsers((prev) => prev.filter((u) => u._id !== id));

      toast.success("User deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const getStatusStyle = (user) =>
    user.isBlocked ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700";

  if (loading) {
    return (
      <div className="p-10 text-center animate-pulse">Loading Users...</div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-semibold">
          Users ({filteredUsers.length})
        </h1>

        <div className="flex w-full sm:w-auto gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-[#5e8741] text-white px-4 py-2 rounded-md cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="space-y-4 md:hidden">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white p-4 rounded-lg shadow space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                {user.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="flex justify-between text-sm">
              <span>Role:</span>
              <span>{user.role}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span>Status:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                  user,
                )}`}
              >
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Link
                to={`/admin/users/${user._id}`}
                className="flex-1 text-center bg-gray-200 py-2 rounded cursor-pointer"
              >
                View
              </Link>

              <button
                onClick={() => toggleStatus(user._id)}
                className="flex-1 bg-[#5e8741] text-white py-2 rounded cursor-pointer"
              >
                {user.isBlocked ? "Unblock" : "Block"}
              </button>

              <button
                onClick={() => handleDelete(user._id)}
                className="flex-1 bg-red-600 text-white py-2 rounded cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4">User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold">
                    {user.name.charAt(0)}
                  </div>
                  <span>{user.name}</span>
                </td>

                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      user,
                    )}`}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td className="text-center space-x-2">
                  <Link
                    to={`/admin/users/${user._id}`}
                    className="bg-gray-200 px-3 py-1 rounded text-sm"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => toggleStatus(user._id)}
                    className="bg-[#5e8741] text-white px-3 py-1 rounded text-sm cursor-pointer"
                  >
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersList;
