package handler

import (
	"encoding/json"
	"net/http"
	"submission_hmc/internal/middleware"
)

type AdminHandler struct{}

func NewAdminHandler() *AdminHandler {
	return &AdminHandler{}
}

func (h *AdminHandler) Dashboard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	userID := r.Context().Value(middleware.UserIDKey)
	email := r.Context().Value(middleware.EmailKey)
	role := r.Context().Value(middleware.RoleKey)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Welcome Admin Dashboard",
		"user_id": userID,
		"email":   email,
		"role":    role,
	})
}
