package service

import (
	"errors"
	"time"

	"submission_hmc/internal/domain"
	"submission_hmc/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService interface {
	Register(user *domain.User) error
	Login(email, password string) (string, error)
}

type authService struct {
	userRepo repository.UserRepository
	jwtKey   []byte
}

var adminIDs = map[int]bool{
	1: true, // ID 1 = admin
}

func NewAuthService(userRepo repository.UserRepository, jwtKey []byte) AuthService {
	return &authService{
		userRepo: userRepo,
		jwtKey:   jwtKey,
	}
}

//REGISTER 
func (s *authService) Register(user *domain.User) error {
	// hash password
	hashedPassword, err := bcrypt.GenerateFromPassword(
		[]byte(user.Password),
		bcrypt.DefaultCost,
	)
	if err != nil {
		return err
	}

	user.Password = string(hashedPassword)
	return s.userRepo.Create(user)
}

// LOGIN
func (s *authService) Login(email, password string) (string, error) {
	user, err := s.userRepo.FindByEmail(email)
	if err != nil {
		return "", errors.New("user not found")
	}

	// validasi password
	err = bcrypt.CompareHashAndPassword(
		[]byte(user.Password),
		[]byte(password),
	)
	if err != nil {
		return "", errors.New("invalid password")
	}

    isAdmin := adminIDs[user.ID]

	// generate JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
        "is_admin": isAdmin,
		"exp":     time.Now().Add(72 * time.Hour).Unix(),
	})

	tokenString, err := token.SignedString(s.jwtKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
