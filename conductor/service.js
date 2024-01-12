const clc = require('cli-color')
const child_process = require('child_process')

function UseConfiguration(configuration) {
    for(let key of Object.keys(configuration)) {
        let flow = new Flow(key, configuration[key].description, configuration[key].scripts)
        flow.run()
    }
}

class Flow {
    name = ""
    description = ""
    scripts = []

    constructor(name, description, scripts) {
        this.name = name ? name : "Unnamed"
        this.description = description ? description : "No description"
        this.scripts = scripts ? scripts : []
    }

    run() {
        this.start(this.name)
        this.info(this.description)

        if(this.scripts.length == 0) this.warn('No scripts specified')

        for(let script of this.scripts) {
            this.runScript(script)
        }
    }

    runScript(script) {
        let stdout = child_process.execSync(script)
        console.log(String(stdout))
    }

    log(...messages) {
        console.log(...messages)
    }

    start(...messages) {
        console.log(clc.bgGreen(`START`), ...messages)
    }

    warn(...messages) {
        console.log(clc.bgYellowBright(`WARN`), ...messages)
    }

    info(...messages) {
        console.log(clc.bgYellowBright(`INFO`), ...messages)
    }

    failed(...messages) {
        console.log(clc.bgRed(`FAIL`), ...messages)
    }
}

module.exports = {
    UseConfiguration
}