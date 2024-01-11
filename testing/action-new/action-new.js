module.exports = {
    setStoreBody: setStoreBody
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function setStoreBody(requestParams, context, ee, next) {
    requestParams.json = {
        author: makeid(9), // Author Name
        created: makeid(12), // (Timestamp) Creation Date
        name: makeid(9), // Action Name
        description: makeid(25), // Action Description
        paused: false, // Action Paused
        source: makeid(50) // Source Code
    }

    return next()
}