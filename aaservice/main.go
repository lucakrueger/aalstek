package main

import (
	"net/http"

	"aalstek.com/m/v2/actions"
	"aalstek.com/m/v2/model"
	"github.com/gin-gonic/gin"
)

func main() {
	model.ConnectDatabase()
	defer model.DisconnectDatabase()

	service := gin.Default()

	actions.AddActionRouter(&service.RouterGroup)

	http.ListenAndServe(":3000", service)
	service.Run()
}
