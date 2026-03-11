import { Menu, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import applogo from "../assets/app_logo.png";

const AdminHeader = ({ setIsOpen }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-between">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={() => setIsOpen(true)}>
          <Menu size={22} />
        </button>

        <img src={applogo} alt="logo" className="h-8 w-auto object-contain" />

        <h1 className="text-lg font-semibold hidden sm:block">Admin Panel</h1>
      </div>

      {/* RIGHT SECTION */}
      <button
        onClick={() => navigate("/admin/login")}
        className="flex items-center gap-2 text-gray-600 hover:text-[#5e8741] transition"
      >
        <LogIn size={20} />
        <span className="hidden sm:inline text-sm">Login</span>
      </button>
    </header>
  );
};

export default AdminHeader;
