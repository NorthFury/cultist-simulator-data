const fs = require("fs")
const path = require('path')
const { gamePath } = require("../../config.json")

function readResource(file) {
    const fullPath = path.join(gamePath, "cultistsimulator_Data/StreamingAssets/content/core", file)
    const content = fs.readFileSync(fullPath, "utf-8")

    const digitPattern = /\d/
    const keyPattern = /[\w.]/

    const sb = []
    let i = 0
    while (i < content.length) {
        let c = content[i++]
        //drop white space characters
        if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
            continue
        }
        // quoted token
        if (c === '"') {
            let index = i
            do {
                c = content[index++]
            } while (c !== '"' || (c === '"' && content[index - 2] === '\\'))
            sb.push(content.substring(i - 1, index).replace(/[\r\n\t]+/g, ''))
            i = index
            continue
        }
        // number token
        if (digitPattern.test(c)) {
            let index = i
            do {
                c = content[index++]
            } while (digitPattern.test(c))
            sb.push(content.substring(i - 1, index - 1))
            i = index - 1
            continue
        }
        // token that should be quoted
        if (keyPattern.test(c)) {
            let index = i
            do {
                c = content[index++]
            } while (keyPattern.test(c))
            let token = content.substring(i - 1, index - 1).trim()
            if (token === "false" || token === "true" || token === "null") sb.push(token)
            else sb.push(`"${token}"`)
            i = index - 1
            continue
        }
        // remove trailing comma
        if (sb.length > 0 && sb[sb.length - 1] === ',' && (c === ']' || c === '}')) {
            sb.pop()
        }
        sb.push(c)
    }

    // drop trailing semicolon
    if (sb[sb.length - 1] === ";") sb.pop()

    return JSON.parse(sb.join(""))
}

module.exports = readResource
