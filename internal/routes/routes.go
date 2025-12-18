package routes

import (
	"github.com/go-chi/chi/v5"

	"submission_hmc/internal/handler"
	mw "submission_hmc/internal/middleware"
)

func RegisterBookRoutes(r chi.Router, h *handler.BookHandler) {
	r.Route("/books", func(r chi.Router) {
		r.Get("/", h.GetBooks)
		r.With(mw.AdminOnly).Post("/", h.CreateBook)
	})
}
