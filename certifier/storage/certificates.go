package storage

import "github.com/gin-gonic/gin"

type LatestRequestUri struct {
}

func GetLatest(context *gin.Context) {
	var request LatestRequestUri

	if err := context.ShouldBindUri(&request); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	context.JSON(200, gin.H{"deleted": true})
}

func TriggerChallenge(context *gin.Context) {
	var request LatestRequestUri

	if err := context.ShouldBindUri(&request); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	context.JSON(200, gin.H{"deleted": true})
}
