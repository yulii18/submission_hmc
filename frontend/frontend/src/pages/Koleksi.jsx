import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// 🔹 Gambar konsisten
function getGambarById(id) {
  const daftarGambar = [
    "/images/b2.jpeg",
    "/images/b3.jpeg",
    "/images/b1.jpeg",
  ];
  let hash = 0;
  for (let c of String(id)) hash += c.charCodeAt(0);
  return daftarGambar[hash % daftarGambar.length];
}

export default function Koleksi() {
  const [koleksi, setKoleksi] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔹 Fetch data
  useEffect(() => {
    fetch(`${API_URL}/books`)
      .then((res) => res.json())
      .then(setKoleksi)
      .finally(() => setLoading(false));
  }, [API_URL]);

  // 🔹 Debounce (cepat & halus)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // 🔹 Filter pintar (judul + penulis, multi kata, ignore spasi)
  const filteredKoleksi = koleksi.filter((item) => {
    const keyword = debouncedSearch
      .toLowerCase()
      .trim()
      .split(" ")
      .filter(Boolean);

    const target = `${item.judul} ${item.penulis}`.toLowerCase();

    return keyword.every((kata) => target.includes(kata));
  });

  if (loading) {
    return <p className="text-center mt-10">Memuat data buku...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* SEARCH BAR */}
      <input
        type="text"
        placeholder="Cari judul atau penulis..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-5 py-3 mb-8 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />

      {filteredKoleksi.length === 0 ? (
        <p className="text-center text-gray-500">Buku tidak ditemukan</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKoleksi.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              {/* GAMBAR */}
              <img
                src={getGambarById(item.id)}
                alt={item.judul}
                className="h-56 w-full object-cover rounded-lg mb-4"
              />

              {/* INFO */}
              <h3 className="font-bold text-lg mb-1">{item.judul}</h3>
              <p className="text-sm text-gray-600">{item.penulis}</p>
              <p className="text-sm text-gray-600">{item.kategori}</p>

              {/* DETAIL */}
              <Link
                to={`/buku/${item.id}`}
                className="mt-auto mt-4 text-center bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
              >
                Lihat Detail
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
