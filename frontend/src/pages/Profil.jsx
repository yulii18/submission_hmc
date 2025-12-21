import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { getPeminjamanSaya } from "../services/bukuService";

export default function Profil() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchPeminjaman = async () => {
      try {
        const res = await getPeminjamanSaya();
        console.log("Peminjaman:", res.data);
        setPeminjaman(res.data || []);
      } catch (err) {
        console.error("Error fetching peminjaman:", err);
        setPeminjaman([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPeminjaman();
  }, [user]);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  if (!user) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-10 w-10 border-b-2 border-yellow-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <div className="bg-linear-to-br from-yellow-400 to-orange-500 rounded-xl p-8 text-white text-center">
            <div className="w-28 h-28 bg-white rounded-full mx-auto flex items-center justify-center text-yellow-600 text-4xl font-bold mb-4">
              {getInitial(user.name)}
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm opacity-90">{user.email}</p>
            <p className="mt-2 text-sm">Role: {user.role}</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Buku Sedang Dipinjam</h2>

          {loading ? (
            <p>Loading...</p>
          ) : peminjaman.length === 0 ? (
            <p className="text-gray-500">Belum ada buku dipinjam</p>
          ) : (
            peminjaman.map((item) => (
              <div key={item.borrowing_id} className="bg-white p-4 rounded shadow mb-3">
                <h3 className="font-semibold">{item.judul}</h3>
                <p className="text-sm text-gray-600">
                  Dipinjam:{" "}
                  {new Date(item.tanggal_pinjam).toLocaleDateString("id-ID")}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
