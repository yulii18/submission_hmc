package routes

import (
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"

	"submission_hmc/internal/handler"
	mw "submission_hmc/internal/middleware"
)

func RegisterBookRoutes(r chi.Router, h *handler.BookHandler) {
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "X-ROLE"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Route("/books", func(r chi.Router) {
		r.Get("/", h.GetBooks)
		r.Get("/{id}", h.GetBookByID)
	
		r.With(mw.AdminOnly).Put("/{id}", h.UpdateBook)
		r.With(mw.AdminOnly).Post("/", h.CreateBook)
		r.With(mw.AdminOnly).Delete("/{id}", h.DeleteBook)
	})
}