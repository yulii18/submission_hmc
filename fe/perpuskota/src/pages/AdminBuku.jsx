import { useEffect, useState } from "react";
import {getBuku, tambahBuku, updateBuku, hapusBuku,} from "../services/bukuService";

export default function AdminBuku() {
  const [buku, setBuku] = useState([]);
  const [form, setForm] = useState({
    id: null,
    judul: "",
    penulis: "",
    kategori: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    loadBuku();
  }, []);

  const loadBuku = async () => {
    const res = await getBuku();
    setBuku(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editMode) {
      await updateBuku(form.id, form);
    } else {
      await tambahBuku(form);
    }

    resetForm();
    loadBuku();
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditMode(true);
  };

  const handleHapus = async (id) => {
    if (window.confirm("Hapus buku ini?")) {
      await hapusBuku(id);
      loadBuku();
    }
  };

  const resetForm = () => {
    setForm({ id: null, judul: "", penulis: "", kategori: "" });
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-yellow-600">
          Admin – Manajemen Buku
        </h1>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editMode ? "Edit Buku" : "Tambah Buku"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              name="judul"
              value={form.judul}
              onChange={handleChange}
              placeholder="Judul Buku"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <input
              name="penulis"
              value={form.penulis}
              onChange={handleChange}
              placeholder="Penulis"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <select
              name="kategori"
              value={form.kategori}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 bg-yellow-50 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Pilih Kategori</option>
              <option value="Pelajaran">Buku Pelajaran</option>
              <option value="Anak">Buku Anak</option>
              <option value="Ilmiah">Buku Ilmiah</option>
            </select>

            <div className="md:col-span-3 flex gap-3 mt-2">
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition"
              >
                {editMode ? "Update" : "Tambah"}
              </button>

              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th className="p-4">Judul</th>
                <th className="p-4">Penulis</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {buku.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    Belum ada buku
                  </td>
                </tr>
              ) : (
                buku.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{item.judul}</td>
                    <td className="p-4">{item.penulis}</td>
                    <td className="p-4">{item.kategori}</td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleHapus(item.id)}
                        className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
