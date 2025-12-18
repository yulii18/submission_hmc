package middleware

import (
	"net/http"
)

func AdminOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		role := r.Header.Get("X-ROLE")

		if role != "admin" {
			http.Error(w, "Forbidden: admin only", http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}