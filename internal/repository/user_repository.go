package repository

import (
	"database/sql"
	"submission_hmc/internal/domain"
)

// Interface UserRepository
type UserRepository interface {
	Create(user domain.User) (int64, error)
	GetByEmail(email string) (*domain.User, error)
}

// Implementasi UserRepository
type userRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(user domain.User) (int64, error) {
	query := `INSERT INTO user (name,email,password,role) VALUES (?,?,?,?)`
	result, err := r.db.Exec(query, user.Name, user.Email, user.Password, user.Role)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func (r *userRepository) GetByEmail(email string) (*domain.User, error) {
	row := r.db.QueryRow(`SELECT id,name,email,password,role FROM user WHERE email=?`, email)
	var u domain.User
	err := row.Scan(&u.ID, &u.Name, &u.Email, &u.Password, &u.Role)
	if err != nil {
		return nil, err
	}
	return &u, nil
}
