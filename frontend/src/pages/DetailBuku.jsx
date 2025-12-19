import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { pinjamBuku } from "../services/peminjamanService";

function getGambarById(id) {
  const daftarGambar = [
    "/images/b2.jpeg",
    "/images/b3.jpeg",
    "/images/b1.jpeg",
  ];
  return daftarGambar[id % daftarGambar.length];
}

export default function DetailBuku() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [buku, setBuku] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  // SIMULASI USER LOGIN (NANTI DARI AUTH)
  const userId = 1;

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await fetch(`${API_URL}/books/${id}`);
      const data = await res.json();
      setBuku(data);
      setLoading(false);
    };

    fetchDetail();
  }, [id, API_URL]);

  const handlePinjam = async () => {
    try {
      await pinjamBuku({
        user_id: userId,
        buku_id: buku.id,
      });

      alert("Buku berhasil dipinjam");
      navigate("/akun");
    } catch (err) {
      alert("Gagal meminjam buku");
    }
  };

  if (loading) return <p className="text-center mt-10">Memuat...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/koleksi")}
        className="mb-6 text-yellow-600 hover:underline"
      >
        ← Kembali
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* GAMBAR */}
        <img
          src={getGambarById(buku.id)}
          alt={buku.judul}
          className="h-80 mx-auto rounded-xl shadow"
        />

        {/* DETAIL */}
        <div className="space-y-4">
          {/* JUDUL BUKU */}
          <h1 className="text-3xl font-bold text-gray-800">{buku.judul}</h1>

          <ul className="space-y-2 text-gray-700 mb-6">
            <li>
              <strong>Penulis:</strong> {buku.penulis}
            </li>
            <li>
              <strong>Sinopsis:</strong> {buku.sinopsis}
            </li>
            <li>
              <strong>Kategori:</strong> {buku.kategori}
            </li>
            <li>
              <strong>Penerbit:</strong> {buku.penerbit}
            </li>
            <li>
              <strong>Tahun:</strong> {buku.tahun}
            </li>
            <li>
              <strong>Stok:</strong> {buku.stok}
            </li>
          </ul>

          <button
            onClick={handlePinjam}
            disabled={buku.stok <= 0}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 disabled:bg-gray-400"
          >
            Pinjam Buku
          </button>
        </div>
      </div>
    </div>
  );
}
