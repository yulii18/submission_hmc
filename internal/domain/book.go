package domain

import "time"

type Book struct {
	ID        int64     `json:"id"`
	Title     string    `json:"title"`
	Author    string    `json:"author"`
	Category  string    `json:"category"`
	Stock     int       `json:"stock"`
	CreatedAt time.Time `json:"created_at"`
}