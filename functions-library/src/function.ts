import { Types } from "./params";

// Inserted V8 Globals //
// Insert Cloud Function
let CloudFunction = {
    name: 'GetUser',
    paramsObject: {}, // Insert from outside
    onRequest: (params: any) => {}
}

// Library //
// Define cloud function Type
export type CloudFunctionT = {
    params: any,
    onRequest: (params: any) => void
}

export namespace Functions {
    /**
     * Registers Cloud function
     * @param functionObject Cloud Function
     */
    export const Register = (functionObject: CloudFunctionT) => {
        // Copy functionObjects (local function) fields to Cloud function to make it accessible from outside
        const paramsObject = new Types.Obj().matches(functionObject.params)
        CloudFunction.paramsObject = paramsObject
        CloudFunction.onRequest = functionObject.onRequest
    }
}

// Create GetUser Cloud Function Object //
let GetUser: CloudFunctionT = {params: {}, onRequest: (params: any) => {}}

// Function (User Space) //
GetUser.params = {
    username: new Types.String().max(32),
    email: new Types.String().contains('@').contains('.'),
    password: new Types.String().min(12)
}

GetUser.onRequest = (params: any) => {
    return {
        value: 'Hello World'
    }
}

Functions.Register(GetUser)

/*
    CloudFunction Object gets cached and precompiled
    The CloudFunctionProcess just has to inject this global and call
        paramsObject.match($requestBody) == true : return onRequest($requestBody) : return error
*/