function Run() {
    if(CloudFunction.paramsObject.match(parameters) == true) {
        return CloudFunction.onRequest(parameters)
    }
    return {failed: 'Dispatch refused'}
}

Run()