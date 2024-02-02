package storage

import "github.com/gin-gonic/gin"

type RegisterRequestBody struct {
}

type RegisterRequestUri struct {
}

func Register(context *gin.Context) {
	var requestUri RegisterRequestUri
	var request RegisterRequestBody

	if err := context.BindJSON(&request); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	if err := context.ShouldBindUri(&requestUri); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	context.JSON(200, gin.H{"deleted": true})
}

func Deregister(context *gin.Context) {
	var requestUri RegisterRequestUri

	if err := context.ShouldBindUri(&requestUri); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	context.JSON(200, gin.H{"deleted": true})
}
