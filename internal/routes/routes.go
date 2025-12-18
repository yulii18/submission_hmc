package routes

import (
	"github.com/go-chi/chi/v5"

	"submission_hmc/internal/handler"
	mw "submission_hmc/internal/middleware"
)

func RegisterBookRoutes(r chi.Router, h *handler.BookHandler) {
	r.Route("/books", func(r chi.Router) {
		r.Get("/", h.GetBooks)
		r.Get("/{id}", h.GetBookByID)
	
		r.With(mw.AdminOnly).Put("/{id}", h.UpdateBook)
		r.With(mw.AdminOnly).Post("/", h.CreateBook)
		r.With(mw.AdminOnly).Delete("/{id}", h.DeleteBook)
	})
}