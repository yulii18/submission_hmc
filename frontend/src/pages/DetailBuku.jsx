import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDetailBuku, pinjamBuku } from "../services/bukuService";
import { authService } from "../services/authService";

function getGambarById(id) {
  const daftarGambar = ["/images/b2.jpeg","/images/b3.jpeg","/images/b1.jpeg",];
  return daftarGambar[Number(id) % daftarGambar.length];}

export default function DetailBuku() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [buku, setBuku] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingPinjam, setLoadingPinjam] = useState(false);

  const isLoggedIn = authService.isAuthenticated();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getDetailBuku(id);
        setBuku(response.data);
      } catch (err) {
        console.error("Error fetching book detail:", err);
        setBuku(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handlePinjam = async () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk meminjam buku");
      navigate("/login");
      return;
    }
    if (buku.stok <= 0) {
      alert("Maaf, stok buku sedang habis");
      return;
    }

    setLoadingPinjam(true);
    try {
      const response = await pinjamBuku(id);
      alert(`Buku "${buku.judul}" berhasil dipinjam!`);
    } catch (err) {
      console.error("Error meminjam buku:", err);
      alert(err.message || "Gagal meminjam buku. Silakan coba lagi.");
    } finally {
      setLoadingPinjam(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail buku...</p>
        </div>
      </div>
    );
  }

  if (!buku) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Buku tidak ditemukan
        </h2>
        <button
          onClick={() => navigate("/koleksi")}
          className="text-yellow-600 hover:underline"
        >
          ← Kembali ke Koleksi
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/koleksi")}
        className="mb-6 text-yellow-600 hover:underline flex items-center gap-2"
      >
        <span>←</span> Kembali ke Koleksi
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="flex justify-center">
          <img
            src={getGambarById(buku.id)}
            alt={buku.judul}
            className="h-80 w-auto rounded-xl shadow-lg object-cover"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{buku.judul}</h1>
          <div className="space-y-3 text-gray-700">
            <div>
              <strong className="text-gray-900">Penulis:</strong>
              <p>{buku.penulis}</p>
            </div>

            <div>
              <strong className="text-gray-900">Sinopsis:</strong>
              <p className="text-sm leading-relaxed">{buku.sinopsis}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <strong className="text-gray-900">Kategori:</strong>
                <p>{buku.kategori}</p>
              </div>
              <div>
                <strong className="text-gray-900">Penerbit:</strong>
                <p>{buku.penerbit}</p>
              </div>
              <div>
                <strong className="text-gray-900">Tahun:</strong>
                <p>{buku.tahun}</p>
              </div>
              <div>
                <strong className="text-gray-900">Stok:</strong>
                <p
                  className={buku.stok > 0 ? "text-green-600" : "text-red-600"}
                >
                  {buku.stok > 0 ? `${buku.stok} tersedia` : "Habis"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            {isLoggedIn ? (
              <button
                onClick={handlePinjam}
                disabled={buku.stok <= 0 || loadingPinjam}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition w-full md:w-auto"
              >
                {loadingPinjam
                  ? "Memproses..."
                  : buku.stok > 0
                  ? "Pinjam Buku"
                  : "Stok Habis"}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/login")}
                  className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition w-full md:w-auto"
                >
                  Login untuk Meminjam
                </button>
                <p className="text-sm text-gray-500">
                  Anda harus login terlebih dahulu untuk meminjam buku
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
