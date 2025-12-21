import { useEffect, useState } from "react";
import {
  getBuku,
  tambahBuku,
  updateBuku,
  hapusBuku,
} from "../services/bukuService";

export default function AdminBuku() {
  const [buku, setBuku] = useState([]);
  const [form, setForm] = useState({
    id: null,
    judul: "",
    penulis: "",
    penerbit: "",
    tahun: "",
    stok: "",
    kategori: "",
    sinopsis: "",
  });
  const [editMode, setEditMode] = useState(false);

  const kategoriOptions = ["Fiksi", "Non Fiksi", "Akademik & Referensi"];

  useEffect(() => {
    loadBuku();
  }, []);

  const loadBuku = async () => {
    try {
      const res = await getBuku();
      setBuku(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil data buku");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tahun: Number(form.tahun),
        stok: Number(form.stok),
      };

      if (editMode) {
        await updateBuku(form.id, payload);
      } else {
        await tambahBuku(payload);
      }

      alert(editMode ? "Buku diperbarui" : "Buku ditambahkan");
      resetForm();
      loadBuku();
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menyimpan buku");
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditMode(true);
  };

  const handleHapus = async (id) => {
    if (confirm("Hapus buku ini?")) {
      try {
        await hapusBuku(id);
        loadBuku();
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus buku");
      }
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      judul: "",
      penulis: "",
      penerbit: "",
      tahun: "",
      stok: "",
      kategori: "",
      sinopsis: "",
    });
    setEditMode(false);
  };

  const inputClass =
    "w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-yellow-600">Admin Buku</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow grid md:grid-cols-3 gap-4"
      >
        <input
          name="judul"
          value={form.judul}
          onChange={handleChange}
          placeholder="Judul Buku"
          className={inputClass}
          required
        />

        <input
          name="penulis"
          value={form.penulis}
          onChange={handleChange}
          placeholder="Penulis"
          className={inputClass}
          required
        />

        <select
          name="kategori"
          value={form.kategori}
          onChange={handleChange}
          className={inputClass}
          required
        >
          <option value="">Pilih Kategori</option>
          {kategoriOptions.map((kat) => (
            <option key={kat} value={kat}>
              {kat}
            </option>
          ))}
        </select>

        <input
          name="penerbit"
          value={form.penerbit}
          onChange={handleChange}
          placeholder="Penerbit"
          className={inputClass}
        />

        <input
          type="number"
          name="tahun"
          value={form.tahun}
          onChange={handleChange}
          placeholder="Tahun"
          className={inputClass}
        />

        <input
          type="number"
          name="stok"
          value={form.stok}
          onChange={handleChange}
          placeholder="Stok"
          className={inputClass}
        />

        <textarea
          name="sinopsis"
          value={form.sinopsis}
          onChange={handleChange}
          placeholder="Sinopsis Buku"
          className="md:col-span-3 border border-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
          rows="4"
        />

        <button
          type="submit"
          className="md:col-span-3 bg-yellow-500 text-white rounded-lg py-2 font-semibold hover:bg-yellow-600"
        >
          {editMode ? "Update Buku" : "Tambah Buku"}
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-yellow-500 text-white">
            <tr>
              <th className="p-3">Judul</th>
              <th className="p-3">Penulis</th>
              <th className="p-3">Kategori</th>
              <th className="p-3">Stok</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {buku.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.judul}</td>
                <td className="p-3">{b.penulis}</td>
                <td className="p-3">{b.kategori}</td>
                <td className="p-3">{b.stok}</td>
                <td className="p-3 flex gap-3">
                  <button
                    onClick={() => handleEdit(b)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleHapus(b.id)}
                    className="text-red-600 hover:underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}

            {buku.length === 0 && (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  Tidak ada data buku
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
