export default function KoleksiCard({ judul, deskripsi, gambar }) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition h-full flex flex-col">
      <img src={gambar} alt={judul} className="w-full h-40 object-cover" />
      <div className="p-6 flex flex-col">
        <h3 className="font-semibold mb-2">{judul}</h3>
        <p className="text-sm text-gray-600 mb-4">{deskripsi}</p>
        <button
          className="mt-auto inline-flex items-center justify-center rounded-lg 
                     bg-yellow-500 px-4 py-2 text-sm font-medium text-white
                     hover:bg-yellow-600 transition"
        >
          Lihat Koleksi
        </button>
      </div>
    </div>
  );
}
