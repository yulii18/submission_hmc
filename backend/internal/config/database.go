package config

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func ConnectDB() (*sql.DB, error) {
	// user := "root"
	// password := "112233"
	// host := "127.0.0.1"
	// port := "3306"
	// dbname := "perpustakaan"

	// dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
	// 	user, password, host, port, dbname,
	// )
	dsn := "root:112233@tcp(localhost:3306)/perpustakaan?parseTime=true"

	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Database terkoneksi")
	return db, nil
}