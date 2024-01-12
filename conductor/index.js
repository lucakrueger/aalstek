const { error, Console } = require('console')
const fs = require('fs')
const process = require('process')
const service = require('./service')
const path = require('path')

if(process.argv.length < 3) {
    console.error("Error: Conductor needs a configuration file")
    return
}

fs.readFile(path.join(__dirname, process.argv[2]), {encoding: 'utf-8'}, (err, data) => {
    if(err != null) {
        console.error(err.message)
        return
    }

    service.UseConfiguration(JSON.parse(data))
})