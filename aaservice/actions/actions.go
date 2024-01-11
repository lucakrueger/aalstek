package actions

import (
	"fmt"

	"aalstek.com/m/v2/model"
	"github.com/gin-gonic/gin"
)

func AddActionRouter(routerGroup *gin.RouterGroup) {
	actionRouter := routerGroup.Group("/actions")

	actionRouter.GET("/info/action/:identifier", actionInfo)
	actionRouter.GET("/info/author/:author", authorInfo)

	actionRouter.POST("/store/", store)
	actionRouter.POST("/store/:identifier", storeURI)
	actionRouter.POST("/pause/:identifier", pause)
	actionRouter.POST("/unpause/:identifier", unpause)

	actionRouter.DELETE("/delete/:identifier", delete)
}

type identifierURIRequest struct {
	Identifier string `uri:"identifier" binding:"required"`
}

type actionInfoBody struct {
	Author      string `json:"author" binding:"required"`
	Created     string `json:"created" binding:"required"`
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
	Paused      bool   `json:"paused"`
	Source      string `json:"source"`
}

type authorURIRequest struct {
	Author string `uri:"author" binding:"required"`
}

func actionInfo(context *gin.Context) {
	var requestURI identifierURIRequest

	if err := context.ShouldBindUri(&requestURI); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	registryEntry, err := model.LookupActionRegistryIdentifier(requestURI.Identifier)

	if err != nil {
		context.JSON(500, gin.H{"failed": err.Error()})
		return
	}

	actionInfo, err := model.LookupActionInfo(registryEntry)

	if err != nil {
		context.JSON(500, gin.H{"failed": err.Error()})
		return
	}

	context.JSON(200, actionInfo)

}

func authorInfo(context *gin.Context) {
	var request authorURIRequest

	if err := context.ShouldBindUri(&request); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	actions, err := model.LookupAuthorInfo(request.Author)

	if err != nil {
		context.JSON(500, gin.H{"failed": err.Error()})
		return
	}

	context.JSON(200, gin.H{
		"actions": actions,
	})
}

func store(context *gin.Context) {
	var request actionInfoBody

	if err := context.BindJSON(&request); err != nil {
		context.JSON(400, gin.H{"failed": err.Error()})
		return
	}

	identifier, err := model.StoreAction(request.Author, request.Created, request.Name, request.Description, request.Paused, request.Source)

	if err != nil {
		context.JSON(500, gin.H{"failed": err.Error()})
		return
	}

	context.JSON(200, gin.H{"identifier": identifier})
}

func storeURI(context *gin.Context) {
	var request actionInfoBody

	if err := context.BindJSON(&request); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	context.JSON(200, request)
}

func pause(context *gin.Context) {
	var requestURI identifierURIRequest

	fmt.Println(context.Params)

	if err := context.ShouldBindUri(&requestURI); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	err := model.UpdateActionField(requestURI.Identifier, "paused", true)

	if err != nil {
		context.JSON(500, gin.H{"failed": err.Error()})
		return
	}

	context.JSON(200, gin.H{"paused": true})
}

func unpause(context *gin.Context) {
	var request identifierURIRequest

	if err := context.ShouldBindUri(&request); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	err := model.UpdateActionField(request.Identifier, "paused", false)

	if err != nil {
		context.JSON(500, gin.H{"failed": err.Error()})
		return
	}

	context.JSON(200, gin.H{"paused": false})
}

func delete(context *gin.Context) {
	var request identifierURIRequest

	if err := context.ShouldBindUri(&request); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	err := model.DeleteAction(request.Identifier)

	if err != nil {
		context.JSON(500, gin.H{"failed": err.Error()})
		return
	}

	context.JSON(200, gin.H{"deleted": true})
}
