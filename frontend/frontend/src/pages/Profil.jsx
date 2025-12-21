import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Profil() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan kata sandi wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) throw new Error("Login gagal");

      const data = await res.json();

      /**
       * data contoh:
       * {
       *   id: 1,
       *   nama: "Budi",
       *   role: "user"
       * }
       */

      //  simpan ke localStorage
      localStorage.setItem("user", JSON.stringify(data));

      // 🔀 CEK ROLE
      if (data.role === "admin") {
        navigate("/admin/buku");
      } else {
        navigate("/akun");
      }
    } catch (error) {
      alert("Email atau kata sandi salah");
      console.error(error);
    } finally {
      setLoading(false);
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
            Masukkan email dan kata sandi yang terdaftar di sistem perpustakaan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
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
                placeholder="Masukkan kata sandi"
                className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-yellow-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
