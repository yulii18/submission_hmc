package service

import (
	"submission_hmc/internal/domain"
	"submission_hmc/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	repo repository.UserRepository
}

func NewUserService(repo repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) GetAllUsers() ([]domain.User, error) {
	return s.repo.GetAll()
}

func (s *UserService) GetUserByID(id int) (*domain.User, error) {
	return s.repo.GetByID(id)
}

func (s *UserService) GetUserByEmail(email string) (*domain.User, error) {
	return s.repo.GetByEmail(email)
}

func (s *UserService) UpdateUser(id int, input domain.User) error {
	existing, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}

	// update hanya field yang dikirim
	if input.Name != "" {
		existing.Name = input.Name
	}
	if input.Email != "" {
		existing.Email = input.Email
	}
	if input.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword(
			[]byte(input.Password),
			bcrypt.DefaultCost,
		)
		if err != nil {
			return err
		}
		existing.Password = string(hashed)
	}
	if input.Role != "" {
		existing.Role = input.Role
	}

	return s.repo.Update(id, *existing)
}

func (s *UserService) DeleteUser(id int) error {
	return s.repo.Delete(id)
}
