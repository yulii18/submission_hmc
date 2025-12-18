export default function Akun() {
  const user = {
    nama: "Andi Saputra",
    id: "AGT-00123",
    email: "andi@mail.com",
  };

  const bukuDipilih = [
    { id: 1, judul: "Algoritma dan Pemrograman", penulis: "R. Munir" },
    { id: 2, judul: "Dasar Sistem Operasi", penulis: "Silberschatz" },
    { id: 3, judul: "Dasar Sistem", penulis: "schatz" },
    { id: 4, judul: "Sistem Operasi", penulis: "Silber" },
  ];

  const bukuDipinjam = [
    {
      id: 101,
      judul: "Pemrograman Web Modern",
      tanggalPinjam: "10 Desember 2025",
      tanggalKembali: "17 Desember 2025",
    },
    {
      id: 102,
      judul: "Kecerdasan Buatan",
      tanggalPinjam: "8 Desember 2025",
      tanggalKembali: "15 Desember 2025",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-6">
          {/* ===== SIDEBAR AKUN (DIAM, TIDAK MEMANJANG, TIDAK STICKY) ===== */}
          <aside className="w-full md:w-1/4 bg-yellow-500 text-white rounded-2xl p-6 self-start">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto rounded-full bg-white text-yellow-500 flex items-center justify-center text-3xl font-bold mb-3">
                {user.nama.charAt(0)}
              </div>
              <h2 className="font-semibold text-lg">{user.nama}</h2>
              <p className="text-sm">{user.id}</p>
            </div>

            <div className="text-sm space-y-2">
              <p>
                <span className="font-semibold">Email:</span>
                <br />
                {user.email}
              </p>
            </div>
          </aside>

          {/* ===== KONTEN KANAN (MEMANJANG) ===== */}
          <main className="flex-1 space-y-10">
            {/* Buku Akan Dipinjam */}
            <section>
              <h1 className="text-2xl font-bold mb-6">
                Buku yang Akan Dipinjam
              </h1>

              <div className="space-y-4">
                {bukuDipilih.map((buku) => (
                  <div
                    key={buku.id}
                    className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{buku.judul}</h3>
                      <p className="text-sm text-gray-500">{buku.penulis}</p>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600">
                        Pinjam
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Buku Sedang Dipinjam */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Buku Sedang Dipinjam</h2>

              <div className="space-y-4">
                {bukuDipinjam.map((buku) => (
                  <div
                    key={buku.id}
                    className="bg-white rounded-xl p-4 shadow-sm flex justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{buku.judul}</h3>
                      <p className="text-sm text-gray-500">
                        Pinjam: <b>{buku.tanggalPinjam}</b>
                      </p>
                      <p className="text-sm text-gray-500">
                        Kembali: <b>{buku.tanggalKembali}</b>
                      </p>
                    </div>
                    <span className="px-4 py-1 h-fit rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
                      Dipinjam
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
