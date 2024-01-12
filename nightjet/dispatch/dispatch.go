package dispatch

import (
	"encoding/json"
	"io"
	"os"

	"github.com/gin-gonic/gin"
)

var testSource string

func AddDispatchRouter(routerGroup *gin.RouterGroup) {
	buf, _ := os.ReadFile("./runtime/test.js")
	testSource = string(buf)

	actionRouter := routerGroup.Group("/dispatch")

	actionRouter.POST("/:identifier", actionByIdentifier)
	actionRouter.POST("n/:author/:name", actionByName)
}

type ActionIdentifierRequest struct {
	Identifier string `uri:"identifier"`
}

type ActionNameRequest struct {
	Author string `uri:"author"`
	Name   string `uri:"name"`
}

func actionByIdentifier(context *gin.Context) {
	var request ActionIdentifierRequest

	if err := context.ShouldBindUri(&request); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	actionSource, actionName, paused, err := GetActionIdentifier(request.Identifier)

	if err != nil {
		context.JSON(500, gin.H{"failed": err.Error()})
		return
	}

	if paused {
		context.JSON(200, gin.H{"failed": "Dispatch refused"})
		return
	}

	params, err := io.ReadAll(context.Request.Body)
	if err != nil {
		context.JSON(500, gin.H{"failed": err.Error()})
		return
	}

	var requestBody map[string]interface{}
	json.Unmarshal(params, &requestBody)

	resultData, err := DispatchScript(actionSource, actionName, requestBody)
	if err != nil {
		context.JSON(500, gin.H{"failed": err.Error()})
		return
	}

	var result map[string]interface{}
	json.Unmarshal(resultData, &result)
	context.JSON(200, result)
}

func actionByName(context *gin.Context) {
	var request ActionNameRequest

	if err := context.ShouldBindUri(&request); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	context.JSON(200, gin.H{"deleted": true})
}
