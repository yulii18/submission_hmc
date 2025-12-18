package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"submission_hmc/internal/config"
	"submission_hmc/internal/handler"
	"submission_hmc/internal/repository"
	"submission_hmc/internal/routes"
	"submission_hmc/internal/service"
)

func main() {
	// koneksi database
	db, err := config.ConnectDB()
	if err != nil {
		log.Fatal("Gagal konek ke DB:", err)
	}
	defer db.Close()

	//layer
	bookRepo := repository.NewBookRepository(db)
	bookService := service.NewBookService(bookRepo)
	bookHandler := handler.NewBookHandler(bookService)	

	// router
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// register routes
	routes.RegisterBookRoutes(r, bookHandler)

	log.Println("Server jalan di http://localhost:8080")
	err = http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatal(err)
	}
}