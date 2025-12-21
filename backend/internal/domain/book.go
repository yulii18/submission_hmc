package domain

import "time"

type Book struct {
	ID        int64     `json:"id"`
	Judul     string    `json:"judul"`
	Sinopsis  string    `json:"sinopsis"`
	Penulis   string    `json:"penulis"`
	Penerbit  string    `json:"penerbit"`
	Tahun     int       `json:"tahun"`
	Stok      int       `json:"stok"`
	Kategori  string    `json:"kategori"`
	CreatedAt time.Time `json:"created_at"`
}
