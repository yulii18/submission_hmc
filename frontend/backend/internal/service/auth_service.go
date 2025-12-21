package service

import (
	"errors"
	"fmt"
	"log"
	"submission_hmc/internal/domain"
	"submission_hmc/internal/repository"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo   repository.UserRepository
	jwtKey []byte
}

func NewAuthService(repo repository.UserRepository, jwtKey []byte) *AuthService {
	return &AuthService{repo: repo, jwtKey: jwtKey}
}

func (a *AuthService) Register(user domain.User) (int64, error) {
	existing, _ := a.repo.GetByEmail(user.Email)
	if existing != nil {
		return 0, errors.New("email already registered")
	}

	hashedPw, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		if err != nil {
		log.Fatal(err)
	}

	user.Password = string(hashedPw)

	user.Role = "member"

	fmt.Println(user)

	return a.repo.Create(user)
}

func (a *AuthService) Login(email, password string) (string, error) {
	user, _ := a.repo.GetByEmail(email)
	if user == nil {
		return "", errors.New("user not found")
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil{
		return "", errors.New("Email atau password tidak ganteng")
	}

	// if user.Password != bcrypt.password {
	// 	return "", errors.New("invalid credentials")
	// }

	claims := jwt.MapClaims{
		"userID": user.ID,
		"email":  user.Email,
		"role":   user.Role,
		"exp":    time.Now().Add(2 * time.Hour).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(a.jwtKey)
}
