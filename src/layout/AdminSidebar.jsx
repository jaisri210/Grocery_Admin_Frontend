import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  X,
} from "lucide-react";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const linkClasses = "flex items-center gap-3 px-4 py-3 rounded-lg transition";
  const activeClasses = "bg-[#5e8741] text-white";
  const inactiveClasses = "text-gray-600 hover:bg-gray-100";

  const handleLogout = () => {
    // Clear admin session
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");

    // Redirect to login
    navigate("/admin/login");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed md:fixed z-40
        top-0 left-0 h-full w-64
        bg-white border-r
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        {/* Mobile Close */}
        <div className="flex justify-between items-center p-4 md:hidden">
          <h2 className="font-semibold">Admin</h2>
          <button onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4 mt-4">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <Package size={18} />
            Products
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <ShoppingCart size={18} />
            Orders
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <Users size={18} />
            Users
          </NavLink>

          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `${linkClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 mt-6 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
