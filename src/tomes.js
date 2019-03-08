const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const tomes = readResource("/decks/tomes.json").decks
    .reduce((acc, it) => {
        acc[it.id] = {
            label: it.label,
            description: it.description,
            items: it.spec
        }
        return acc
    }, {})

delete tomes.oneoffrewards

console.log(toLuaTable(tomes))
