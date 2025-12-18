import axios from "axios";

const API_URL = "http://localhost:5000/api/buku";

export const getBuku = () => axios.get(API_URL);
export const tambahBuku = (data) => axios.post(API_URL, data);
export const updateBuku = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const hapusBuku = (id) => axios.delete(`${API_URL}/${id}`);
