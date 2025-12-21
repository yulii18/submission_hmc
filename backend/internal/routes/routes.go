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
	userHandler *handler.UserHandler,
	borrowHandler *handler.BorrowHandler,
	jwtKey []byte,
) {
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// ========== AUTH ==========
	r.Post("/register", authHandler.Register)
	r.Post("/login", authHandler.Login)

	// ========== USER PROFILE ==========
	r.With(middleware.JWTMiddleware(jwtKey)).Get("/profile", userHandler.GetProfile)

	// ========== HEALTH CHECK ==========
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Server OK"))
	})

	// ========== ADMIN DASHBOARD ==========
	r.Route("/admin", func(r chi.Router) {
		r.Use(middleware.JWTMiddleware(jwtKey))
		r.Use(middleware.AdminOnly)
		r.Get("/dashboard", adminHandler.Dashboard)
	})

	// ========== ADMIN – USER MANAGEMENT ==========
	r.Route("/admin/users", func(r chi.Router) {
		r.Use(middleware.JWTMiddleware(jwtKey))
		r.Use(middleware.AdminOnly)

		r.Get("/", userHandler.GetUsers)
		r.Get("/{id}", userHandler.GetUserByID)
		r.Get("/email/{email}", userHandler.GetUserByEmail)
		r.Put("/{id}", userHandler.UpdateUser)
		r.Delete("/{id}", userHandler.DeleteUser)
	})

	// ========== BOOK ROUTES ==========
	r.Route("/books", func(r chi.Router) {

		// ---- Public ----
		r.Get("/category/{category_id}", bookHandler.GetBooksByCategory)

		r.Get("/", bookHandler.GetBooks)
		r.Get("/{id}", bookHandler.GetBookByID)

		// ---- Borrowing (User Login Required) ----
		r.With(middleware.JWTMiddleware(jwtKey)).
			Post("/borrow/{id}", borrowHandler.Borrow)

		r.With(middleware.JWTMiddleware(jwtKey)).
			Get("/borrowings", borrowHandler.GetMyBorrowings)

		// ---- Admin Only ----
		r.With(middleware.JWTMiddleware(jwtKey), middleware.AdminOnly).
			Post("/", bookHandler.CreateBook)

		r.With(middleware.JWTMiddleware(jwtKey), middleware.AdminOnly).
			Put("/{id}", bookHandler.UpdateBook)

		r.With(middleware.JWTMiddleware(jwtKey), middleware.AdminOnly).
			Delete("/{id}", bookHandler.DeleteBook)
	})
}
