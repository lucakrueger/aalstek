package storage

import (
	"time"

	"go.etcd.io/bbolt"
)

var Database *bbolt.DB

func ConnectDatabase() error {
	var err error
	Database, err = bbolt.Open("service.db", 0600, &bbolt.Options{Timeout: 5 * time.Second})
	if err != nil {
		return err
	}

	return nil
}

func DisconnectDatabase() error {
	return Database.Close()
}
