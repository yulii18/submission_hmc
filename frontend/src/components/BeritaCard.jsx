export default function BeritaCard({ judul, tanggal, ringkas, gambar }) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition cursor-pointer h-full">
    <img src={gambar} alt={judul} className="w-full h-40 object-cover" />
      <div className="p-6">
        <p className="text-xs text-gray-500 mb-1">{tanggal}</p>
        <h3 className="font-semibold mb-2">{judul}</h3>
        <p className="text-sm text-gray-600">{ringkas}</p>
        <p className="text-s text-yellow-500 mt-4">Lihat di Instagram →</p>
      </div>
    </div>
  );
}
