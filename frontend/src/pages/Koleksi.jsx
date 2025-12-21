import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function getGambarById(id) {
  const daftarGambar = ["/images/b2.jpeg","/images/b3.jpeg","/images/b1.jpeg",];
  let hash = 0;
  for (let c of String(id)) hash += c.charCodeAt(0);
  return daftarGambar[hash % daftarGambar.length];
}

export default function Koleksi() {
  const [koleksi, setKoleksi] = useState([]);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/books`)
      .then((res) => res.json())
      .then(setKoleksi)
      .finally(() => setLoading(false));
  }, [API_URL]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);
  console.log(koleksi);

  const kategoriOptions = ["Semua","Fiksi","Non Fiksi","Akademik & Referensi",];

  const filteredKoleksi = koleksi.filter((item) => {
    if (kategori !== "Semua" && item.kategori !== kategori) return false;
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
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Cari judul atau penulis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        />

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
        >
          {kategoriOptions.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>

      {filteredKoleksi.length === 0 ? (
        <p className="text-center text-gray-500">Buku tidak ditemukan</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKoleksi.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              <img
                src={getGambarById(item.id)}
                alt={item.judul}
                className="h-56 w-full object-cover rounded-lg mb-4"
              />

              <h3 className="font-bold text-lg mb-1">{item.judul}</h3>
              <p className="text-sm text-gray-600 mb-3">{item.penulis}</p>

              <Link
                to={`/buku/${item.id}`}
                className="mt-auto text-center bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
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
