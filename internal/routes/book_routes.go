package routes

import (
	"github.com/go-chi/chi/v5"

	"submission_hmc/internal/handler"
)

func BookRoutes(r chi.Router, bookHandler *handler.BookHandler) {
	r.Route("/books", func(r chi.Router) {
		r.Get("/", bookHandler.GetBooks)
		r.Post("/", bookHandler.CreateBook)
	})
}