package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"nightjet.aalstek.com/m/v2/dispatch"
)

func main() {
	service := gin.Default()

	dispatch.BuildCache()

	dispatch.PrecompileRuntime()
	dispatch.AddDispatchRouter(&service.RouterGroup)

	http.ListenAndServe(":3001", service)
	service.Run()
}
