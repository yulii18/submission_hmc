package domain

import "time"

type Borrowing struct {
    ID         int       `json:"id"`
    UserID     int       `json:"user_id"`
    BookID     int       `json:"book_id"`
    BorrowedAt time.Time `json:"borrowed_at"`
    ReturnedAt *time.Time `json:"returned_at,omitempty"`
}

