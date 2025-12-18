package domain

import "time"

type Book struct {
	ID        int64     `json:"id"`
	Judul     string    `json:"judul"`
	Penulis   string    `json:"penulis"`
	Penerbit  string    `json:"penerbit"`
	Tahun     int       `json:"tahun"`
	Stok      int       `json:"stok"`
	CreatedAt time.Time `json:"created_at"`
}
