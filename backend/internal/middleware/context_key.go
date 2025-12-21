package middleware

import "context"

type contextKey string

const (
    UserIDKey contextKey = "userID"
    EmailKey  contextKey = "email"
	RoleKey   contextKey = "role"
)

func SetUserIDToContext(ctx context.Context, userID int) context.Context {
    return context.WithValue(ctx, UserIDKey, userID)
}

func GetUserIDFromContext(ctx context.Context) int {
    if uid, ok := ctx.Value(UserIDKey).(int64); ok {
        return int(uid)
    }
    return 0
}

func GetUserEmailFromContext(ctx context.Context) string {
    if email, ok := ctx.Value(EmailKey).(string); ok {
        return email
    }
    return ""
}

func GetUserRoleFromContext(ctx context.Context) string {
    if role, ok := ctx.Value(RoleKey).(string); ok {
        return role
    }
    return ""
}