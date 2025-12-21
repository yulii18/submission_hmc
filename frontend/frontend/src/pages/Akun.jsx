import { useEffect, useState } from "react";
import { getPeminjamanUser } from "../services/peminjamanService";

export default function Akun() {
  // ⛔ sementara hardcode, nanti ganti dari login/auth
  const user = {
    id: 1, // ← INI PENTING: ID USER DARI DATABASE
    nama: "Andi Saputra",
    email: "andi@mail.com",
  };

  const [bukuDipinjam, setBukuDipinjam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPeminjaman();
  }, []);

  const loadPeminjaman = async () => {
    try {
      const res = await getPeminjamanUser(user.id);
      setBukuDipinjam(res.data);
    } catch (err) {
      console.error("Gagal ambil peminjaman:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* SIDEBAR */}
          <aside className="w-full md:w-1/4 bg-yellow-500 text-white rounded-2xl p-6 self-start">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-white text-yellow-500 flex items-center justify-center text-3xl font-bold mb-3">
                {user.nama.charAt(0)}
              </div>
              <h2 className="font-semibold text-lg">{user.nama}</h2>
              <p className="text-sm">ID: {user.id}</p>
            </div>

            <p className="text-sm">
              <b>Email:</b>
              <br />
              {user.email}
            </p>
          </aside>

          {/* KONTEN */}
          <main className="flex-1 space-y-10">
            {/* BUKU DIPINJAM */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Buku Sedang Dipinjam</h2>

              {loading ? (
                <p>Memuat data...</p>
              ) : bukuDipinjam.length === 0 ? (
                <p className="text-gray-500">Belum ada buku yang dipinjam</p>
              ) : (
                <div className="space-y-4">
                  {bukuDipinjam.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl p-4 shadow-sm flex justify-between gap-4"
                    >
                      <div>
                        <h3 className="font-semibold text-lg">{item.judul}</h3>
                        <p className="text-sm text-gray-500">
                          Pinjam: <b>{item.tanggal_pinjam}</b>
                        </p>
                        <p className="text-sm text-gray-500">
                          Kembali: <b>{item.tanggal_kembali}</b>
                        </p>
                      </div>

                      <span className="px-4 py-1 h-fit rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                        Dipinjam
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
