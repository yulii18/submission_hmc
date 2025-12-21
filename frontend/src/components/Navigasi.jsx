import { NavLink, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export default function Navigasi() {
  const navigate = useNavigate();
  const isLoggedIn = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();

  const menuClass = ({ isActive }) =>
    isActive
      ? "text-yellow-600 font-semibold border-b-2 border-yellow-600 pb-1"
      : "text-gray-700 hover:text-yellow-600";

  const handleLogout = () => {
    authService.logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
    
        <div className="flex items-center gap-2 font-bold text-yellow-600">
          <img
            src="/images/Lambang.png"
            alt="PerpusKota"
            className="w-8 h-8 object-contain"
          />
          <span>PerpusKota</span>
        </div>

    
        <nav className="flex gap-6 text-sm items-center">
          <NavLink to="/" end className={menuClass}>
            Beranda
          </NavLink>

          <NavLink to="/koleksi" className={menuClass}>
            Koleksi
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin/buku" className={menuClass}>
              Admin
            </NavLink>
          )}

          {isLoggedIn && !isAdmin && (
            <NavLink to="/profil" className={menuClass}>
              Profil
            </NavLink>
          )}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-yellow-500 text-white px-4 py-1.5 rounded hover:bg-yellow-600 transition"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className="bg-yellow-600 text-white px-4 py-1.5 rounded hover:bg-yellow-700 transition"
            >
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
