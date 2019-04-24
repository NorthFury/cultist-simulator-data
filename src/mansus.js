const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const vaultRewards = readResource("/decks/mansus.json").decks
    .reduce((acc, it) => {
        acc[it.id] = {
            items: it.spec,
            messages: it.drawmessages
        }
        return acc
    }, {})

console.log(toLuaTable(vaultRewards))
