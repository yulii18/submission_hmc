import axios from "axios";
import { authService } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthConfig = () => {
  const token = authService.getToken();
  if (!token) {
    throw new Error("Token tidak ditemukan, silakan login ulang");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const isAdmin = () => authService.isAdmin();
export const getBuku = () => axios.get(`${API_URL}/books`);
export const getDetailBuku = (id) => axios.get(`${API_URL}/books/${id}`);


export const pinjamBuku = async (bookId) => {
  if (!authService.isAuthenticated()) {
    throw new Error("Anda harus login terlebih dahulu");
  }

  return axios.post(`${API_URL}/books/borrow/${bookId}`, {}, getAuthConfig());
};


export const getPeminjamanSaya = async () => {
  if (!authService.isAuthenticated()) {
    throw new Error("Anda harus login terlebih dahulu");
  }

  return axios.get(`${API_URL}/books/borrowings`, getAuthConfig());
};


export const kembalikanBuku = async (borrowId) => {
  if (!authService.isAuthenticated()) {
    throw new Error("Anda harus login terlebih dahulu");
  }

  return axios.post(
    `${API_URL}/borrows/${borrowId}/return`,
    {},
    getAuthConfig()
  );
};

export const tambahBuku = async (data) => {
  if (!authService.isAuthenticated()) {
    throw new Error("Anda harus login terlebih dahulu");
  }
  if (!isAdmin()) {
    throw new Error("Hanya admin yang dapat menambah buku");
  }

  return axios.post(`${API_URL}/books`, data, getAuthConfig());
};

export const updateBuku = async (id, data) => {
  if (!authService.isAuthenticated()) {
    throw new Error("Anda harus login terlebih dahulu");
  }
  if (!isAdmin()) {
    throw new Error("Hanya admin yang dapat mengupdate buku");
  }

  return axios.put(`${API_URL}/books/${id}`, data, getAuthConfig());
};

export const hapusBuku = async (id) => {
  if (!authService.isAuthenticated()) {
    throw new Error("Anda harus login terlebih dahulu");
  }
  if (!isAdmin()) {
    throw new Error("Hanya admin yang dapat menghapus buku");
  }

  return axios.delete(`${API_URL}/books/${id}`, getAuthConfig());
};

export const getAllPeminjaman = async () => {
  if (!authService.isAuthenticated()) {
    throw new Error("Anda harus login terlebih dahulu");
  }
  if (!isAdmin()) {
    throw new Error("Hanya admin yang dapat melihat data ini");
  }

  return axios.get(`${API_URL}/borrows`, getAuthConfig());
};
