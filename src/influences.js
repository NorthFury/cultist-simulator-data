const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")
const trimGameHints = require("./util/trimGameHints")

const aspects = readResource("/elements/influences.json").elements
    .reduce((acc, it) => {
        acc[it.id] = {
            label: it.label,
            description: trimGameHints(it.description),
            aspects: it.aspects,
            decayTo: it.decayTo
        }
        if (!it.decayTo) delete acc[it.id].decayTo
        return acc
    }, {})

console.log(toLuaTable(aspects))
