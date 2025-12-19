package main

import (
	"log"
	"net/http"
	"os"
	"submission_hmc/internal/config"
	"submission_hmc/internal/handler"
	"submission_hmc/internal/repository"
	"submission_hmc/internal/routes"
	"submission_hmc/internal/service"

	"github.com/go-chi/chi/v5"
)

func main() {
	jwtKey := []byte(os.Getenv("JWT_SECRET"))

	db, err := config.ConnectDB()
	if err != nil {
		log.Fatal(err)
	}

	userRepo := repository.NewUserRepository(db)
	bookRepo := repository.NewBookRepository(db)

	authService := service.NewAuthService(userRepo, jwtKey)
	bookService := service.NewBookService(bookRepo)

	authHandler := handler.NewAuthHandler(authService)
	bookHandler := handler.NewBookHandler(bookService)
	adminHandler := handler.NewAdminHandler()

	r := chi.NewRouter()

	routes.RegisterRoutes(r, authHandler, bookHandler, adminHandler, jwtKey)

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
