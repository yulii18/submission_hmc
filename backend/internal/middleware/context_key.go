package middleware

type contextKey string

const (
    UserIDKey contextKey = "userID"
    EmailKey  contextKey = "email"
	RoleKey   contextKey = "role"
)