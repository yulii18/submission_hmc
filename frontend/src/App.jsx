import { BrowserRouter, Routes, Route } from "react-router";
import Navigasi from "./components/Navigasi";
import Footer from "./components/Footer";
import Beranda from "./pages/Beranda";
import Koleksi from "./pages/Koleksi";
import Profil from "./pages/Profil";
import DetailBuku from "./pages/DetailBuku";
import Akun from "./pages/Akun";
import AdminBuku from "./pages/AdminBuku"; 

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

            <Route path="/buku/:id" element={<DetailBuku />} />
            <Route path="/akun" element={<Akun />} />
            <Route path="/admin/buku" element={<AdminBuku />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
