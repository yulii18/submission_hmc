package models
import "time"

type Borrowing struct {
    ID             int     `json:"id"`
    UserID         int     `json:"user_id"`
    BookID         int     `json:"book_id"`
    TanggalPinjam  string  `json:"tanggal_pinjam"`
    TanggalKembali *string `json:"tanggal_kembali"`
    Status         string  `json:"status"`
}

type BorrowingDetail struct {
    BorrowingID    int       `json:"borrowing_id"`
    TanggalPinjam  time.Time `json:"tanggal_pinjam"`
    TanggalKembali *time.Time `json:"tanggal_kembali"`
    Status         string    `json:"status"`

    BookID    int    `json:"book_id"`
    Judul     string `json:"judul"`
    Penulis   string `json:"penulis"`
    Penerbit  string `json:"penerbit"`
    Tahun     int    `json:"tahun"`
    Kategori  string `json:"kategori"`
}