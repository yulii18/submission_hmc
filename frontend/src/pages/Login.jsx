import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      const isAdmin = authService.isAdmin();
      navigate(isAdmin ? "/admin/buku" : "/profil");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authService.login(
        formData.email,
        formData.password
      );

      // Tunggu sebentar agar localStorage pasti tersimpan
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Cek apakah ada redirectAfterLogin
      const redirectPath = localStorage.getItem("redirectAfterLogin");

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        const isAdmin = authService.isAdmin();
        navigate(isAdmin ? "/admin/buku" : "/profil");
      }
    } catch (err) {
      setError(err.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to -br from-yellow-50 to-orange-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/images/Lambang.png"
            alt="PerpusKota"
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-yellow-600">PerpusKota</h1>
          <p className="text-gray-600 mt-2">Masuk ke akun Anda</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-600 text-white py-2.5 rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-yellow-600 font-semibold hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
