import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Koleksi() {
  const [koleksi, setKoleksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBuku = async () => {
      try {
        console.log("FETCH KE:", `${API_URL}/books`);

        const res = await fetch(`${API_URL}/books`);
        if (!res.ok) throw new Error("Gagal fetch data");

        const data = await res.json();
        console.log("DATA API:", data);

        // FIELD SESUAI DATABASE
        setKoleksi(
          data.map((item) => ({
            id: item.id,
            judul: item.judul,
            kategori: item.kategori,
            penulis: item.penulis,
            penerbit: item.penerbit,
            tahun: item.tahun,
            stok: item.stok,
          }))
        );
      } catch (err) {
        console.error("ERROR FETCH:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuku();
  }, [API_URL]);

  if (loading) {
    return <p className="text-center mt-10">Memuat data buku...</p>;
  }

  // 🔍 FILTER JUDUL
  const filteredKoleksi = koleksi.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Cari buku..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 rounded-lg shadow mb-6"
      />

      {/* LIST */}
      {filteredKoleksi.length === 0 ? (
        <p className="text-center text-gray-500">Buku tidak ditemukan</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredKoleksi.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow p-4">
              <h3 className="font-bold text-lg">{item.judul}</h3>
              <p>Penulis: {item.penulis}</p>
              <p>Penerbit: {item.penerbit}</p>
              <p>Tahun: {item.tahun}</p>
              <p>Stok: {item.stok}</p>

              <Link
                to={`/buku/${item.id}`}
                className="inline-block mt-3 text-yellow-600 font-semibold"
              >
                Lihat Detail →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
