
package main

import (
	"database/sql"
	"log"
	"net/http"

	"submission_hmc/internal/handler"
	"submission_hmc/internal/middleware"
	"submission_hmc/internal/repository"
	"submission_hmc/internal/service"

	"github.com/go-chi/chi/v5"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	// Connect ke database
	db, err := sql.Open(
		"mysql",
		"root:@tcp(127.0.0.1:3306)/perpustakaan?parseTime=true",
	)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	userRepo := repository.NewUserRepository(db)
	authService := service.NewAuthService(userRepo, []byte("secret_key"))
	authHandler := handler.NewAuthHandler(authService)

	r := chi.NewRouter()

	
	r.Post("/auth/login", authHandler.Login)

	
	r.Route("/user", func(r chi.Router) {
		r.Use(middleware.JWTMiddleware([]byte("secret_key"))) 
		r.Get("/profile", authHandler.Profile)               
	})

	
	r.Route("/admin", func(r chi.Router) {
	r.Use(middleware.JWTMiddleware([]byte("secret_key")))
	r.Use(middleware.AdminOnly) // HARUS dikenali sekarang
	r.Get("/", authHandler.AdminDashboard)
    })

	log.Println("server running at :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
