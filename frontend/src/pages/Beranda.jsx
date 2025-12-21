import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { beritaList } from "../data/data";
import BeritaCard from "../components/BeritaCard";
import KoleksiCard from "../components/KoleksiCard";

export default function Beranda() {
  const [koleksi, setKoleksi] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;
  const daftarGambar = ["/images/b1.jpeg","/images/b2.jpeg","/images/b3.jpeg",];

  useEffect(() => {
    const fetchBuku = async () => {
      try {
        const res = await axios.get(`${API_URL}/books`);
        if (Array.isArray(res.data)) {
          setKoleksi(res.data.slice(0, 3)); 
        }
      } catch (err) {
        console.error("Gagal ambil data beranda:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuku();
  }, [API_URL]);
  return (
    <div className="bg-gray-50">
      <section className="w-full overflow-hidden">
        <img
          src="/images/perpus.jpg"
          alt="Perpustakaan Kota"
          className="w-full h-[85vh] object-cover rounded-2xl"
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        <section>
          <h2 className="text-3xl font-bold text-center mb-10">
            Berita Terbaru
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {beritaList.map((item, index) => (
              <a key={index} href={item.link} target="_blank" rel="noreferrer">
                <BeritaCard {...item} />
              </a>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-10">Koleksi</h2>

          {loading ? (
            <p className="text-gray-500">Memuat koleksi...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {koleksi.map((item, index) => (
                  <KoleksiCard
                    key={item.id}
                    judul={item.judul}
                    penulis={item.penulis}
                    gambar={daftarGambar[index % daftarGambar.length]}
                  />
                ))}
              </div>

              <Link
                to="/koleksi"
                className="inline-block bg-yellow-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition"
              >
                Lihat Semua Koleksi
              </Link>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
