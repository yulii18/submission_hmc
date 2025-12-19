import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// ===================================
// PINJAM buku
// ===================================
export const pinjamBuku = (data) => {
  return axios.post(`${API_URL}/borrow`, data);
};

// ===================================
// GET peminjaman berdasarkan USER
// ===================================
export const getPeminjamanUser = (userId) => {
  return axios.get(`${API_URL}/borrow/user/${userId}`);
};

// ===================================
// KEMBALIKAN buku
// ===================================
export const kembalikanBuku = (id) => {
  return axios.put(`${API_URL}/borrow/${id}/return`);
};
