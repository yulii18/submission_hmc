import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// GET semua buku
export const getBuku = () => axios.get(`${API_URL}/books`);

// TAMBAH buku
export const tambahBuku = (data) => axios.post(`${API_URL}/books`, data);

// UPDATE buku
export const updateBuku = (id, data) =>
  axios.put(`${API_URL}/books/${id}`, data);

// HAPUS buku
export const hapusBuku = (id) => axios.delete(`${API_URL}/books/${id}`);
