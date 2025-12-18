import { NavLink } from "react-router-dom";

export default function Navigasi() {
  const menuClass = ({ isActive }) =>
    isActive
      ? "text-yellow-600 font-semibold border-b-2 border-yellow-600 pb-1"
      : "text-gray-700 hover:text-yellow-600";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LOGO */}
        <div className="flex items-center gap-2 font-bold text-yellow-600">
        <img
            src="/images/Lambang.png"
            alt="PerpusKota"
            className="w-8 h-8 object-contain"
          />
          <span>PerpusKota</span>
        </div>

        {/* NAVBAR */}
        <nav className="flex gap-6 text-sm">
          <NavLink to="/" end className={menuClass}>
            Beranda
          </NavLink>
          <NavLink to="/koleksi" className={menuClass}>
            Koleksi
          </NavLink>
          <NavLink to="/profil" className={menuClass}>
            Profil
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
