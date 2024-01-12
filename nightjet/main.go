package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"nightjet.aalstek.com/m/v2/dispach"
)

func main() {
	service := gin.Default()

	dispach.AddDispachRouter(&service.RouterGroup)

	http.ListenAndServe(":3001", service)
	service.Run()
}
