import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Profil() {
  const navigate = useNavigate();

  const [idAnggota, setIdAnggota] = useState("");
  const [password, setPassword] = useState(  "");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔐 nanti diganti request ke database
    if (idAnggota && password) {
      navigate("/akun");
    } else {
      alert("ID Anggota dan Kata Sandi wajib diisi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start">
      <div className="w-full max-w-5xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-md p-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Masuk Anggota Perpustakaan
          </h1>

          <p className="text-gray-600 mb-8 max-w-2xl">
            Masukan ID anggota serta kata sandi yang diberikan oleh
            administrator sistem perpustakaan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">
                ID Anggota
              </label>
              <input
                type="text"
                value={idAnggota}
                onChange={(e) => setIdAnggota(e.target.value)}
                placeholder="Masukkan ID Anggota"
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Kata Sandi
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan Kata Sandi"
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <button
              type="submit"
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Masuk
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
