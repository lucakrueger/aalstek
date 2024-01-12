GetTest.params = {
    username: new Types.String().max(32),
    email: new Types.String().contains('@').contains('.'),
    password: new Types.String().min(12)
}

GetTest.onRequest = (params) => {
    return {
        ...params
    }
}

Functions.Dispatch(GetTest)