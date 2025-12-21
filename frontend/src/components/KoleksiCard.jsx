export default function KoleksiCard({ judul, penulis, gambar }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="w-full h-48 flex justify-center mb-4">
        <img
          src={gambar}
          alt={judul}
          onError={(e) => (e.target.src = "/images/default.jpg")}
          className="h-full w-auto object-cover rounded-lg shadow"
        />
      </div>

      <h3 className="font-bold text-lg">{judul}</h3>
      <p className="text-sm text-gray-600">{penulis}</p>
    </div>
  );
}
