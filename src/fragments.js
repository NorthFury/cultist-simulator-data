const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const fragments = readResource("/elements/fragments.json").elements.reduce((acc, it) => {
    // fragmentglory is most likely a message from AK to people reading the config files
    if (it.id === "fragmentglory") return acc

    acc[it.id] = it
    delete it.slots
    delete it.xtriggers
    delete it.id
    return acc
}, {})

console.log(toLuaTable(fragments))
