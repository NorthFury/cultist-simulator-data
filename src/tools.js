const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const tools = readResource("/elements/tools.json").elements
    .filter(it => it.id !== "dropzone")
    .reduce((acc, it) => {
        acc[it.id] = it
        delete it.id
        return acc
    }, {})

console.log(toLuaTable(tools))
