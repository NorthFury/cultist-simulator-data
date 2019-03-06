const fs = require("fs")
const path = require('path')
const { gamePath } = require("../../config.json")

const assetsPath = path.join(gamePath, "cultistsimulator_Data/StreamingAssets/content/core")

function readResource(file) {
    var content = fs.readFileSync(path.join(assetsPath, file), "utf-8")
    if (content.endsWith(";")) content = content.substr(0, content.length - 1)
    content = content.replace(/([{[,])[\s\r\n]*([a-zA-Z][\w.]+)\s*:/g, '$1"$2":')
    content = content.replace(/":[\s\r\n]*([a-zA-Z][\w.]+)/g, '":"$1"')
    content = content.replace(/,[\s\r\n]*(]|})/g, "$1")
    return JSON.parse(content)
}

module.exports = readResource
