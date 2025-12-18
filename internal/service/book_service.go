package service

import (
	"context"

	"submission_hmc/internal/domain"
	"submission_hmc/internal/repository"
)

type BookService interface {
	GetAllBooks(ctx context.Context) ([]domain.Book, error)
	CreateBook(ctx context.Context, book *domain.Book) error
}

type bookService struct {
	bookRepo repository.BookRepository
}

func NewBookService(bookRepo repository.BookRepository) BookService {
	return &bookService{bookRepo: bookRepo}
}

func (s *bookService) GetAllBooks(ctx context.Context) ([]domain.Book, error) {
	return s.bookRepo.FindAll(ctx)
}

func (s *bookService) CreateBook(ctx context.Context, book *domain.Book) error {
	return s.bookRepo.Create(ctx, book)
}
