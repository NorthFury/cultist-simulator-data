const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const aspects = readResource("/elements/_aspects.json").elements
    .filter(it => !it.isHidden && !it.noartneeded)
    .reduce((acc, it) => {
        acc[it.id] = {
            label: it.label,
            description: it.description
        }
        return acc
    }, {})

console.log(toLuaTable(aspects))
