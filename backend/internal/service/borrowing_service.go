package service

import (
	"submission_hmc/internal/repository"
	"submission_hmc/internal/models"
)

type BorrowingService struct {
    Repo repository.BorrowingRepository
}

func NewBorrowingService(repo repository.BorrowingRepository) *BorrowingService {
    return &BorrowingService{Repo: repo}
}

func (s *BorrowingService) BorrowBook(userID, bookID int) (*models.Borrowing, error) {
    return s.Repo.Create(userID, bookID)
}

func (s *BorrowingService) GetMyBorrowings(userID int) ([]models.BorrowingDetail, error) {
    return s.Repo.FindByUserID(userID)
}

