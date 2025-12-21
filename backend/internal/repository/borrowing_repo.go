package repository

import (
	"database/sql"
	"errors"

	"submission_hmc/internal/models"
)

type BorrowingRepository interface {
    Create(userID, bookID int) (*models.Borrowing, error)
	FindByUserID(userID int) ([]models.BorrowingDetail, error)
}

type borrowingRepo struct {
    db *sql.DB
}

func NewBorrowingRepository(db *sql.DB) BorrowingRepository {
    return &borrowingRepo{db}
}


func (r *borrowingRepo) Create(userID, bookID int) (*models.Borrowing, error) {
    tx, err := r.db.Begin()
    if err != nil {
        return nil, err
    }
    defer tx.Rollback()

    res, err := tx.Exec(`
        UPDATE books
        SET stok = stok - 1
        WHERE id = ? AND stok > 0
    `, bookID)
    if err != nil {
        return nil, err
    }

    rowsAffected, err := res.RowsAffected()
    if err != nil {
        return nil, err
    }
    if rowsAffected == 0 {
        return nil, errors.New("stok buku habis")
    }

    res, err = tx.Exec(`
        INSERT INTO borrowings (user_id, book_id, tanggal_pinjam, status)
        VALUES (?, ?, CURDATE(), 'dipinjam')
    `, userID, bookID)
    if err != nil {
        return nil, err
    }

    borrowingID, err := res.LastInsertId()
    if err != nil {
        return nil, err
    }

    row := tx.QueryRow(`
        SELECT id, user_id, book_id, tanggal_pinjam, tanggal_kembali, status
        FROM borrowings
        WHERE id = ?
    `, borrowingID)

    var b models.Borrowing
    err = row.Scan(
        &b.ID,
        &b.UserID,
        &b.BookID,
        &b.TanggalPinjam,
        &b.TanggalKembali,
        &b.Status,
    )
    if err != nil {
        return nil, err
    }

    if err := tx.Commit(); err != nil {
        return nil, err
    }

    return &b, nil
}

func (r *borrowingRepo) FindByUserID(userID int) ([]models.BorrowingDetail, error) {
    query := `
        SELECT
            br.id,
            br.tanggal_pinjam,
            br.tanggal_kembali,
            br.status,
            b.id,
            b.judul,
            b.penulis,
            b.penerbit,
            b.tahun,
            IFNULL(GROUP_CONCAT(c.nama_kategori), '') AS kategori
        FROM borrowings br
        JOIN books b ON br.book_id = b.id
        LEFT JOIN book_categories bc ON b.id = bc.book_id
        LEFT JOIN categories c ON bc.category_id = c.id
        WHERE br.user_id = ?
        GROUP BY br.id
        ORDER BY br.tanggal_pinjam DESC
    `

    rows, err := r.db.Query(query, userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var result []models.BorrowingDetail

    for rows.Next() {
        var b models.BorrowingDetail
        var tanggalKembali sql.NullTime

        err := rows.Scan(
            &b.BorrowingID,
            &b.TanggalPinjam,
            &tanggalKembali,
            &b.Status,
            &b.BookID,
            &b.Judul,
            &b.Penulis,
            &b.Penerbit,
            &b.Tahun,
            &b.Kategori,
        )
        if err != nil {
            return nil, err
        }

        if tanggalKembali.Valid {
            b.TanggalKembali = &tanggalKembali.Time
        } else {
            b.TanggalKembali = nil
        }

        result = append(result, b)
    }

    if err := rows.Err(); err != nil {
        return nil, err
    }

    return result, nil
}
