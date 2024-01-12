package dispatch

import (
	"fmt"
	"os"

	v8 "rogchap.com/v8go"
)

var dispatchSource string
var dispatchCache *v8.CompilerCachedData
var runtimeSource string
var runtimeCache *v8.CompilerCachedData

func PrecompileRuntime() error {
	var err error
	dispatchSource, dispatchCache, err = PrecompileFile("./runtime/dispatch.js", "dispatch.js")
	if err != nil {
		return err
	}

	runtimeSource, runtimeCache, err = PrecompileFile("./runtime/runtime.js", "runtime.js")
	if err != nil {
		return err
	}

	return nil
}

func PrecompileFile(path string, name string) (string, *v8.CompilerCachedData, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return "", nil, err
	}

	cache, err := PrecompileScript(string(data), name)

	return string(data), cache, err
}

func PrecompileScript(source string, name string) (*v8.CompilerCachedData, error) {
	isolate := v8.NewIsolate()

	script, err := isolate.CompileUnboundScript(source, name, v8.CompileOptions{})
	if err != nil {
		return nil, err
	}

	return script.CreateCodeCache(), nil
}

func DispatchScript(source string, name string, params map[string]interface{}) ([]byte, error) {
	isolate := v8.NewIsolate()
	defer isolate.Dispose()

	global := v8.NewObjectTemplate(isolate)
	global.Set("exports", v8.NewObjectTemplate(isolate))

	global.Set("print", v8.NewFunctionTemplate(isolate, func(info *v8.FunctionCallbackInfo) *v8.Value {
		fmt.Printf("%v\n", info.Args())
		return nil
	}))

	cloudFunction := v8.NewObjectTemplate(isolate)
	cloudFunction.Set("name", name)
	cloudFunction.Set("paramsObject", v8.NewObjectTemplate(isolate))
	cloudFunction.Set("onRequest", v8.NewObjectTemplate(isolate))

	functionDelegate := v8.NewObjectTemplate(isolate)
	functionDelegate.Set("params", v8.NewObjectTemplate(isolate))
	functionDelegate.Set("onRequest", v8.NewObjectTemplate(isolate))

	global.Set("CloudFunction", cloudFunction)
	global.Set(name, functionDelegate)

	parameters, _ := mapToV8ObjectTemplate(isolate, params)

	global.Set("parameters", parameters)

	context := v8.NewContext(isolate, global)
	defer context.Close()

	script, err := isolate.CompileUnboundScript(dispatchSource, "dispatch.js", v8.CompileOptions{CachedData: dispatchCache})
	if err != nil {
		return nil, err
	}
	script.Run(context)

	_, err = context.RunScript(source, "function.js")
	if err != nil {
		return nil, err
	}
	//value, _ := context.RunScript("return CloudFunction.onRequest(parameters)", "runtime.js")

	script, err = isolate.CompileUnboundScript(runtimeSource, "runtime.js", v8.CompileOptions{CachedData: runtimeCache})
	if err != nil {
		return nil, err
	}
	value, _ := script.Run(context)

	return value.MarshalJSON()
}

func mapToV8ObjectTemplate(iso *v8.Isolate, data map[string]interface{}) (*v8.ObjectTemplate, error) {
	objectTemplate := v8.NewObjectTemplate(iso)

	for key, value := range data {
		switch val := value.(type) {
		case map[string]interface{}:
			// Recursively handle nested maps
			nestedObjectTemplate, err := mapToV8ObjectTemplate(iso, val)
			if err != nil {
				return nil, err
			}
			objectTemplate.Set(key, nestedObjectTemplate)
		default:
			// Set non-map values directly
			objectTemplate.Set(key, val)
		}
	}

	return objectTemplate, nil
}
