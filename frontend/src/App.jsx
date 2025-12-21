import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigasi from "./components/Navigasi";
import Footer from "./components/Footer";
import Beranda from "./pages/Beranda";
import Koleksi from "./pages/Koleksi";
import Profil from "./pages/Profil";
import DetailBuku from "./pages/DetailBuku";
import AdminBuku from "./pages/AdminBuku";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navigasi />

        <div className="p-6 flex-1">
          <Routes>
            <Route path="/" element={<Beranda />} />
            <Route path="/koleksi" element={<Koleksi />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/login" element={<Login />} />

            <Route path="/buku/:id" element={<DetailBuku />} />
            <Route path="/admin/buku" element={<AdminBuku />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
