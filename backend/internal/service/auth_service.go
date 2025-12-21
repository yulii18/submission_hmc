package service

import (
	"errors"
	"time"

	"submission_hmc/internal/domain"
	"submission_hmc/internal/repository"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo   repository.UserRepository
	jwtKey []byte
}

func NewAuthService(repo repository.UserRepository, jwtKey []byte) *AuthService {
	return &AuthService{
		repo:   repo,
		jwtKey: jwtKey,
	}
}

// ================= REGISTER =================
func (a *AuthService) Register(user domain.User) (int64, error) {
	existing, _ := a.repo.GetByEmail(user.Email)
	if existing != nil {
		return 0, errors.New("email already registered")
	}

	hashedPw, err := bcrypt.GenerateFromPassword(
		[]byte(user.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return 0, err
	}

	user.Password = string(hashedPw)
	user.Role = "member" // default role

	return a.repo.Create(user)
}

// ================= LOGIN =================
func (a *AuthService) Login(email, password string) (string, error) {
	user, _ := a.repo.GetByEmail(email)
	if user == nil {
		return "", errors.New("user not found")
	}

	err := bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(password),
	)
	if err != nil {
		return "", errors.New("email atau password salah")
	}

	claims := jwt.MapClaims{
		"userID": float64(user.ID), 
		"email": user.Email,
		"role":  user.Role,
		"exp":   time.Now().Add(2 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(a.jwtKey)
}
