const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const mundane = readResource("/elements/mundane_elements.json").elements
    .reduce((acc, it) => {
        acc[it.id] = {
            label: it.label,
            description: it.description,
            aspects: it.aspects
        }
        return acc
    }, {})

console.log(toLuaTable(mundane))
