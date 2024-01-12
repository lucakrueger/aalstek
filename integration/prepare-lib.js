const fs = require('fs')
const path = require('path')

fs.readFile(path.join(__dirname, '../aalstek-functions-library/dist/src/dispatch.js'), {encoding: 'utf-8'}, (err, data) => {
    if(err != null) {
        console.error(err.message)
        return
    }

    let lines = String(data).split('\n')
    let newLines = []
    
    let ignore = false

    for(let i = 0; i < lines.length; i++) {
        let line = lines[i]

        if(line.includes('@remove-from')) {
            ignore = true
            continue
        } else if(line.includes('@remove-to')) {
            ignore = false
            continue
        } else if(line.includes('@remove-until')) {
            newLines = []
            ignore = false
            continue
        } else if(line.includes('@remove-next')) {
            i += 1
            continue
        } else if(line.includes('@remove')) {
            continue
        }

        if(ignore == false) {
            newLines.push(line)
        }
    }

    fs.writeFile(path.join(__dirname, '../nightjet/runtime/dispatch.js'), newLines.join('\n'), (err) => {
        if(err != null) {
            console.error(err)
            return
        }

        console.log('Dispatch Library packaged.')
    })
})