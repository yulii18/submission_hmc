package handler

import (
    "encoding/json"
    "net/http"
    "strconv"

    "github.com/go-chi/chi/v5"
    "submission_hmc/internal/middleware"
    "submission_hmc/internal/service"
)

type BorrowHandler struct {
    service *service.BorrowingService
}

func NewBorrowHandler(s *service.BorrowingService) *BorrowHandler {
    return &BorrowHandler{s}
}

func (h *BorrowHandler) Borrow(w http.ResponseWriter, r *http.Request) {
    userID := middleware.GetUserIDFromContext(r.Context())

    bookID, err := strconv.Atoi(chi.URLParam(r, "id"))
    if err != nil {
        http.Error(w, "invalid book id", http.StatusBadRequest)
        return
    }

    borrowing, err := h.service.BorrowBook(userID, bookID)
    if err != nil {
        http.Error(w, "failed to borrow book", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(borrowing)
}

func (h *BorrowHandler) GetMyBorrowings(w http.ResponseWriter, r *http.Request) {
    userID := middleware.GetUserIDFromContext(r.Context())

    data, err := h.service.GetMyBorrowings(userID)
    if err != nil {
        http.Error(w, "failed to get borrowings", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(data)
}

