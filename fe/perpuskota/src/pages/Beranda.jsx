import { Link } from "react-router-dom";
import { beritaList, koleksiList } from "../data/data";
import BeritaCard from "../components/BeritaCard";
import KoleksiCard from "../components/KoleksiCard";

export default function Beranda() {
  return (
    <div className="bg-gray-50">
      {/* ================= HERO IMAGE ================= */}
      <section className="w-full overflow-hidden">
        <img
          src="/images/perpus.jpg"
          alt="Perpustakaan Kota Palu"
          className="w-full h-[85vh] object-cover object-center"
        />
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-20">
        {/* ================= BERITA TERBARU ================= */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Berita Terbaru
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {beritaList.map((item, index) => (
              <a
                key={index}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BeritaCard
                  judul={item.judul}
                  tanggal={item.tanggal}
                  ringkas={item.ringkas}
                  gambar={item.gambar}
                />
              </a>
            ))}
          </div>
        </section>

        {/* ================= KOLEKSI ================= */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            Koleksi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {koleksiList.map((item, index) => (
              <Link
                key={index}
                to={`/koleksi?kategori=${encodeURIComponent(item.kategori)}`}
              >
                <KoleksiCard
                  judul={item.judul}
                  deskripsi={item.deskripsi}
                  gambar={item.gambar}
                />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
