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
	config.ConnectDB()

	// init router
	r := chi.NewRouter()

	// middleware dasar
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// dependency injection
	bookRepo := repository.NewBookRepository(config.DB)
	bookService := service.NewBookService(bookRepo)
	bookHandler := handler.NewBookHandler(bookService)

	// routes
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Server Perpustakaan API is running 🚀"))
	})

	routes.BookRoutes(r, bookHandler)

	// start server
	log.Println("Server berjalan di http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
