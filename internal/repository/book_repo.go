package repository

import (
	"context"
	"database/sql"

	"submission_hmc/internal/domain"
)

type BookRepository interface {
	FindAll(ctx context.Context) ([]domain.Book, error)
	Create(ctx context.Context, book *domain.Book) error
}

type bookRepository struct {
	db *sql.DB
}

func NewBookRepository(db *sql.DB) BookRepository {
	return &bookRepository{db: db}
}

func (r *bookRepository) FindAll(ctx context.Context) ([]domain.Book, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, judul, penulis, penerbit, tahun, stok, created_at FROM books
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	books := make([]domain.Book, 0)
	for rows.Next() {
		var b domain.Book
		if err := rows.Scan(
			&b.ID,
			&b.Judul,
			&b.Penulis,
			&b.Penerbit,
			&b.Tahun,
			&b.Stok,
			&b.CreatedAt,
		); err != nil {
			return nil, err
		}
		books = append(books, b)
	}

	return books, nil
}

func (r *bookRepository) Create(ctx context.Context, book *domain.Book) error {
	query := `
		INSERT INTO books (judul, penulis, penerbit, tahun, stok)
		VALUES (?, ?, ?, ?, ?)
	`
	result, err := r.db.ExecContext(
		ctx,
		query,
		book.Judul,
		book.Penulis,
		book.Penerbit,
		book.Tahun,
		book.Stok,
	)
	if err != nil {
		return err
	}

	id, _ := result.LastInsertId()
	book.ID = id
	return nil
}