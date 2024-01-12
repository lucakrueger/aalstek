"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Functions = void 0;
const params_1 = require("./params");
// Inserted V8 Globals //
// Insert Cloud Function
let CloudFunction = {
    name: 'GetUser',
    paramsObject: {},
    onRequest: (params) => { }
};
var Functions;
(function (Functions) {
    /**
     * Registers Cloud function
     * @param functionObject Cloud Function
     */
    Functions.Register = (functionObject) => {
        // Copy functionObjects (local function) fields to Cloud function to make it accessible from outside
        const paramsObject = new params_1.Types.Obj().matches(functionObject.params);
        CloudFunction.paramsObject = paramsObject;
        CloudFunction.onRequest = functionObject.onRequest;
    };
})(Functions || (exports.Functions = Functions = {}));
// Create GetUser Cloud Function Object //
let GetUser = { params: {}, onRequest: (params) => { } };
// Function (User Space) //
GetUser.params = {
    username: new params_1.Types.String().max(32),
    email: new params_1.Types.String().contains('@').contains('.'),
    password: new params_1.Types.String().min(12)
};
GetUser.onRequest = (params) => {
    return {
        value: 'Hello World'
    };
};
Functions.Register(GetUser);
/*
    CloudFunction Object gets cached and precompiled
    The CloudFunctionProcess just has to inject this global and call
        paramsObject.match($requestBody) == true : return onRequest($requestBody) : return error
*/ 
