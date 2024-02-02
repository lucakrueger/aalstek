package main

import (
	"net/http"

	"certifier.aalstek.com/m/v2/storage"
	"github.com/gin-gonic/gin"
)

func main() {
	service := gin.Default()

	service.GET("/latest/:url", storage.GetLatest)

	service.POST("/register/:url", storage.Register)
	service.POST("/deregister/:url", storage.Deregister)
	service.POST("/trigger/:url", storage.TriggerChallenge)

	http.ListenAndServe(":3002", service)
	service.Run()
}
