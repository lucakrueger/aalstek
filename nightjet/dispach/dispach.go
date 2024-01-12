package dispach

import (
	v8 "rogchap.com/v8go"

	"github.com/gin-gonic/gin"
)

func AddDispachRouter(routerGroup *gin.RouterGroup) {
	actionRouter := routerGroup.Group("/dispach")

	actionRouter.POST("/:identifier", actionByIdentifier)
	actionRouter.POST("n/:author/:name", actionByName)
}

type ActionIdentifierRequest struct {
}

type ActionNameRequest struct {
}

func actionByIdentifier(context *gin.Context) {
	var request ActionIdentifierRequest

	if err := context.ShouldBindUri(&request); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	ctx := v8.NewContext()                                  // creates a new V8 context with a new Isolate aka VM
	ctx.RunScript("const add = (a, b) => a + b", "math.js") // executes a script on the global context
	ctx.RunScript("const result = add(3, 4)", "main.js")    // any functions previously added to the context can be called
	val, _ := ctx.RunScript("result", "value.js")           // return a value in JavaScript back to Go

	context.JSON(200, gin.H{"result": val.Number()})
}

func actionByName(context *gin.Context) {
	var request ActionNameRequest

	if err := context.ShouldBindUri(&request); err != nil {
		context.JSON(400, gin.H{"failed": "Failed to read request parameters"})
		return
	}

	context.JSON(200, gin.H{"deleted": true})
}
