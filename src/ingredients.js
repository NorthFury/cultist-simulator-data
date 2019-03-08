const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const ingredients = readResource("/elements/ingredients.json").elements
    .reduce((acc, it) => {
        acc[it.id] = it
        delete it.id
        delete it.xtriggers
        return acc
    }, {})

console.log(toLuaTable(ingredients))
