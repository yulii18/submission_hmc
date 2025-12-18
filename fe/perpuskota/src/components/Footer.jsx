export default function Footer() {
  return (
    <footer className="bg-yellow-500">
      <div className="max-w-7xl mx-auto px-40 py-8 flex flex-col md:flex-row justify-between items-start gap-12 text-sm">
        {/* JAM OPERASIONAL */}
        <div className="md:text-left">
          <h3 className="font-bold text-black mb-2">Jam Operasional</h3>

          <div className="mb-4">
            <h4 className="text-black font-semibold">Layanan Reguler</h4>
            <p className="text-white">Senin-Kamis: 07.40-16.00</p>
            <p className="text-white">Jumat: 07.40-14.00</p>
          </div>

          <div className="mb-4">
            <h4 className="text-black font-semibold">Layanan Berkegiatan</h4>
            <p className="text-white">Sabtu-Minggu: 07.00-16.00</p>
          </div>

          <div>
            <h4 className="text-black font-semibold">Tutup</h4>
            <p className="text-white">Hari Nasional & Cuti Bersama</p>
          </div>
        </div>

        {/* KONTAK */}
        <div className="md:text-left">
          <h3 className="font-bold text-black mb-2">Kontak</h3>
          <p className="text-white">
            Email: perpuskota@email.com <br />
            Telepon: (021) 123-4567 <br />
            Instagram: @perpuskotapalu
          </p>
        </div>
      </div>
    </footer>
  );
}
