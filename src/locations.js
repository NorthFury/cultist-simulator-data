const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")
const trimGameHints = require("./util/trimGameHints")

const locations = readResource("/elements/city_locations.json").elements
    .reduce((acc, it) => {
        acc[it.id] = {
            label: it.label,
            description: trimGameHints(it.description),
            aspects: it.aspects
        }
        if (it.unique) acc[it.id].unique = true
        return acc
    }, {})

console.log(toLuaTable(locations))
