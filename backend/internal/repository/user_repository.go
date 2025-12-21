package repository

import (
	"database/sql"
	"submission_hmc/internal/domain"
)

type UserRepository interface {
	Create(user domain.User) (int64, error)
    GetByEmail(email string) (*domain.User, error)
    GetAll() ([]domain.User, error)
    GetByID(id int) (*domain.User, error)
    Update(id int, user domain.User) error
    Delete(id int) error
}

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

func (r *userRepository) GetAll() ([]domain.User, error) {
	rows, err := r.db.Query(`SELECT id, name, email, password, role FROM user`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []domain.User
	for rows.Next() {
		var u domain.User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.Password, &u.Role); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

func (r *userRepository) GetByID(id int) (*domain.User, error) {
	row := r.db.QueryRow(`SELECT id, name, email, password, role FROM user WHERE id=?`, id)
	var u domain.User
	err := row.Scan(&u.ID, &u.Name, &u.Email, &u.Password, &u.Role)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *userRepository) Update(id int, user domain.User) error {
	_, err := r.db.Exec(`UPDATE user SET name=?, email=?, password=?, role=? WHERE id=?`,
		user.Name, user.Email, user.Password, user.Role, id)
	return err
}

func (r *userRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM user WHERE id=?`, id)
	return err
}
