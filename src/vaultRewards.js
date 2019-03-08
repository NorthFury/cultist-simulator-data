const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const aspects = readResource("/decks/vault_rewards.json").decks
    .reduce((acc, it) => {
        acc[it.id] = {
            label: it.label,
            rewards: it.spec
        }
        return acc
    }, {})

console.log(toLuaTable(aspects))
