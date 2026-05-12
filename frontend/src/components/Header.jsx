import { LogOut, Menu, Search, UserCircle, Youtube } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getStoredUser } from "../utils/auth";

function Header({ onToggleSidebar, searchTerm, onSearchChange }) {
  const navigate = useNavigate();
  const user = getStoredUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-2 sm:px-4 md:px-6 bg-white border-b border-gray-200 gap-2">
      <div className="flex items-center gap-2 sm:gap-4 flex-none">
        <button className="p-2 hover:bg-gray-100 rounded-full" type="button" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          <Menu size={22} />
        </button>
        <Link to="/" className="flex items-center gap-1 font-bold text-xl" aria-label="YouTube Clone home">
          <span className="flex items-center justify-center w-8 h-6 bg-red-600 text-white rounded">
            <Youtube size={16} fill="currentColor" />
          </span>
          <span className="hidden sm:inline">YouTube</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl px-2 sm:px-4 min-w-0">
        <label className="flex items-center h-10 border border-gray-300 rounded-full overflow-hidden focus-within:border-blue-600 bg-white min-w-0">
          <input
            className="flex-1 px-3 sm:px-4 h-full outline-none min-w-0 w-full"
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search videos"
          />
          <div className="flex items-center justify-center w-10 sm:w-14 bg-gray-50 border-l border-gray-300 h-full flex-none">
            <Search size={20} className="text-gray-600" />
          </div>
        </label>
      </div>

      <div className="flex items-center justify-end flex-none">
        {user ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full font-semibold whitespace-nowrap">
              <UserCircle size={22} />
              <span className="hidden sm:inline">{user.username}</span>
            </span>
            <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-full font-semibold whitespace-nowrap" type="button" onClick={handleLogout}>
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        ) : (
          <Link className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 border border-gray-300 text-blue-600 font-semibold rounded-full hover:bg-blue-50 whitespace-nowrap text-sm sm:text-base" to="/login">
            <UserCircle size={20} />
            <span>Sign in</span>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
