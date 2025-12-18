import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function DetailBuku() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [buku, setBuku] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBuku(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500">Memuat detail buku...</p>;
  }

  return (
    <div className="max-w-5xl px-4">
      {/* TOMBOL KEMBALI */}
      <button
        onClick={() => navigate("/koleksi")}
        className=" bg-white text-yellow-600"
      >
        ← Kembali ke Koleksi
      </button>

      {/* KONTEN */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* GAMBAR */}
        <div className="flex justify-center">
          <img
            src={buku.image}
            alt={buku.title}
            className="w-full object-contain"
          />
        </div>

        {/* TEKS */}
        <div>
          <h1 className="text-2xl font-bold mb-4">{buku.title}</h1>

          <p className="text-gray-600 leading-relaxed mb-6">
            {buku.description}
          </p>

          <p className="text-xl font-semibold text-yellow-600">
            Rp {(buku.price * 15000).toLocaleString("id-ID")}
          </p>
        </div>
      </div>
    </div>
  );
}
