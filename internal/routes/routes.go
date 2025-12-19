package routes

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"

	"submission_hmc/internal/handler"
	"submission_hmc/internal/middleware"
)

func RegisterRoutes(
	r chi.Router,
	authHandler *handler.AuthHandler,
	bookHandler *handler.BookHandler,
	adminHandler *handler.AdminHandler,
	jwtKey []byte,
) {
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Post("/register", authHandler.Register)
	r.Post("/login", authHandler.Login)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Server OK"))
	})

	r.Route("/admin", func(r chi.Router) {
		r.Use(middleware.JWTMiddleware(jwtKey))
		r.Use(middleware.AdminOnly)
		r.Get("/dashboard", adminHandler.Dashboard)
	})

	r.Route("/books", func(r chi.Router) {
		r.Use(middleware.JWTMiddleware(jwtKey))

		r.Get("/", bookHandler.GetBooks)
		r.Get("/{id}", bookHandler.GetBookByID)

		r.With(middleware.AdminOnly).Post("/", bookHandler.CreateBook)
		r.With(middleware.AdminOnly).Put("/{id}", bookHandler.UpdateBook)
		r.With(middleware.AdminOnly).Delete("/{id}", bookHandler.DeleteBook)
	})
}
