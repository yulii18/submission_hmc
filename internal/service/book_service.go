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
		SELECT id, title, author, category, stock, created_at FROM books
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []domain.Book
	for rows.Next() {
		var b domain.Book
		if err := rows.Scan(
			&b.ID,
			&b.Title,
			&b.Author,
			&b.Category,
			&b.Stock,
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
		INSERT INTO books (title, author, category, stock)
		VALUES (?, ?, ?, ?)
	`
	result, err := r.db.ExecContext(
		ctx,
		query,
		book.Title,
		book.Author,
		book.Category,
		book.Stock,
	)
	if err != nil {
		return err
	}

	id, _ := result.LastInsertId()
	book.ID = id
	return nil
}