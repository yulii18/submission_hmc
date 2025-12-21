package repository

import (
	"context"
	"database/sql"
	"fmt"

	"submission_hmc/internal/domain"
)

type BookRepository interface {
	FindAll(ctx context.Context) ([]domain.Book, error)
	Create(ctx context.Context, book *domain.Book) error
	FindByID(ctx context.Context, id int64) (*domain.Book, error)
	FindByCategoryID(ctx context.Context, categoryID int) ([]domain.Book, error)
	Update(ctx context.Context, book *domain.Book) error
	Delete(ctx context.Context, id int64) error
}

type bookRepository struct {
	db *sql.DB
}

func NewBookRepository(db *sql.DB) BookRepository {
	return &bookRepository{db: db}
}

func (r *bookRepository) FindAll(ctx context.Context) ([]domain.Book, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT 
			b.id,
			b.judul,
			b.sinopsis,
			b.penulis,
			b.penerbit,
			b.tahun,
			b.stok,
			IFNULL(GROUP_CONCAT(c.nama_kategori), '') AS kategori,
			b.created_at
		FROM books b
		LEFT JOIN book_categories bc ON b.id = bc.book_id
		LEFT JOIN categories c ON bc.category_id = c.id
		GROUP BY b.id
		ORDER BY b.created_at DESC
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
			&b.Sinopsis,
			&b.Penulis,
			&b.Penerbit,
			&b.Tahun,
			&b.Stok,
			&b.Kategori,
			&b.CreatedAt,
		); err != nil {
			return nil, err
		}

		books = append(books, b)
	}

	return books, nil
}


func (r *bookRepository) Create(ctx context.Context, book *domain.Book) error {
	// Mulai transaction
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	// 1️⃣ Insert book
	queryInsertBook := `
		INSERT INTO books (judul, sinopsis, penulis, penerbit, tahun, stok)
		VALUES (?, ?, ?, ?, ?, ?)
	`
	result, err := tx.ExecContext(
		ctx,
		queryInsertBook,
		book.Judul,
		book.Sinopsis,
		book.Penulis,
		book.Penerbit,
		book.Tahun,
		book.Stok,
	)
	if err != nil {
		tx.Rollback()
		return err
	}

	bookID, err := result.LastInsertId()
	if err != nil {
		tx.Rollback()
		return err
	}
	book.ID = bookID

	// 2️⃣ Ambil kategori
	queryGetCategory := `SELECT id, nama_kategori FROM categories WHERE nama_kategori = ? LIMIT 1`

	var category struct {
		ID   int64
		Nama string
	}

	err = tx.QueryRowContext(ctx, queryGetCategory, book.Kategori).Scan(&category.ID, &category.Nama)
	if err != nil {
		if err == sql.ErrNoRows {
			tx.Rollback()
			fmt.Println("Kategori tidak ditemukan")
			return fmt.Errorf("kategori '%s' tidak ditemukan", book.Kategori)
		}
		tx.Rollback()
		return err
	}

	// 3️⃣ Insert ke pivot table
	queryPivot := `INSERT INTO book_categories (book_id, category_id) VALUES (?, ?)`
	_, err = tx.ExecContext(ctx, queryPivot, bookID, category.ID)
	if err != nil {
		tx.Rollback()
		return err
	}

	// 4️⃣ Commit transaction
	return tx.Commit()
}


func (r *bookRepository) FindByID(ctx context.Context, id int64) (*domain.Book, error) {
	row := r.db.QueryRowContext(ctx, `
        SELECT 
            b.id,
            b.judul,
            b.sinopsis,
            b.penulis,
            b.penerbit,
            b.tahun,
            b.stok,
            IFNULL(GROUP_CONCAT(c.nama_kategori), ''),
            b.created_at
        FROM books b
        LEFT JOIN book_categories bc ON b.id = bc.book_id
        LEFT JOIN categories c ON bc.category_id = c.id
        WHERE b.id = ?
        GROUP BY b.id
    `, id)

	var b domain.Book
	err := row.Scan(
		&b.ID,
		&b.Judul,
		&b.Sinopsis,
		&b.Penulis,
		&b.Penerbit,
		&b.Tahun,
		&b.Stok,
		&b.Kategori,
		&b.CreatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &b, nil
}

func (r *bookRepository) Update(ctx context.Context, book *domain.Book) error {
	_, err := r.db.ExecContext(ctx, `
		UPDATE books
		SET judul=?, sinopsis=?, penulis=?, penerbit=?, tahun=?, stok=?
		WHERE id=?
	`,
		book.Judul,
		book.Sinopsis,	
		book.Penulis,
		book.Penerbit,
		book.Tahun,
		book.Stok,
		book.ID,
	)
	return err
}

func (r *bookRepository) Delete(ctx context.Context, id int64) error {
	_, err := r.db.ExecContext(ctx, `
		DELETE FROM books WHERE id=?
	`, id)
	return err
}

func (r *bookRepository) FindByCategoryID(
	ctx context.Context,
	categoryID int,
) ([]domain.Book, error) {

	rows, err := r.db.QueryContext(ctx, `
		SELECT
			b.id,
			b.judul,
			b.penulis,
			b.penerbit,
			b.tahun,
			b.stok,
			GROUP_CONCAT(c.nama_kategori) AS kategori
		FROM books b
		JOIN book_categories bc ON b.id = bc.book_id
		JOIN categories c ON bc.category_id = c.id
		WHERE c.id = ?
		GROUP BY b.id
	`, categoryID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var books []domain.Book

	for rows.Next() {
		var b domain.Book
		err := rows.Scan(
			&b.ID,
			&b.Judul,
			&b.Penulis,
			&b.Penerbit,
			&b.Tahun,
			&b.Stok,
			&b.Kategori,
		)
		if err != nil {
			return nil, err
		}
		books = append(books, b)
	}

	return books, nil
}
