import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export const pinjamBuku = async ({ buku_id }) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/books/${buku_id}/borrow`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal meminjam buku");
  }

  return res.json();
};

export const getPeminjamanUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User belum login");

  const res = await fetch(`${API_URL}/borrow/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gagal mengambil data peminjaman");
  }

  return res.json();
};
