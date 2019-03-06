const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const rituals = readResource("/elements/rituals.json").elements.reduce((acc, it) => {
    acc[it.id] = {
        label: it.label,
        slots: it.slots.map(slot => {
            const result = {
                id: slot.id,
                required: Object.keys(slot.required)
            }
            if (slot.consumes) result.consumes = true
            return result
        })
    }
    return acc
}, {})

console.log(toLuaTable(rituals))
