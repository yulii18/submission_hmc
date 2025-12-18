import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

export default function Koleksi() {
  const [koleksi, setKoleksi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");

  const [searchParams] = useSearchParams();

  const kategoriOptions = [
    "Semua",
    "Buku Pelajaran",
    "Buku Anak",
    "Buku Ilmiah",
  ];

  // 🔹 Ambil data API
  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((res) => {
      const data = res.data.slice(0, 12).map((item, index) => {
        let cat = "Buku Pelajaran";
        if (index % 3 === 1) cat = "Buku Anak";
        else if (index % 3 === 2) cat = "Buku Ilmiah";
        return { ...item, kategori: cat };
      });

      setKoleksi(data);
      setLoading(false);
    });
  }, []);

  // 🔹 AMBIL KATEGORI DARI URL (INI INTINYA)
  useEffect(() => {
    const kategoriUrl = searchParams.get("kategori");
    if (kategoriUrl && kategoriOptions.includes(kategoriUrl)) {
      setKategori(kategoriUrl);
    }
  }, [searchParams]);

  if (loading) return <p className="text-center">Memuat koleksi...</p>;

  // 🔹 FILTER SESUAI KATEGORI
  const filteredKoleksi = koleksi.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());

    const matchKategori = kategori === "Semua" || item.kategori === kategori;

    return matchSearch && matchKategori;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Cari buku..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg shadow"
        />

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="px-4 py-2 rounded-lg shadow"
        >
          {kategoriOptions.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredKoleksi.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow p-4 flex flex-col"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-48 object-contain mb-4"
            />
            <h3 className="font-semibold mb-4 line-clamp-2">{item.title}</h3>
            <Link
              to={`/buku/${item.id}`}
              className="mt-auto bg-yellow-500 text-white py-2 rounded-xl text-center"
            >
              Lihat Detail
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
