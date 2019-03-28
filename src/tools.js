const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const toolGifts = readResource("/recipes/talking_8_follower.json").recipes
    .filter(it => it.id.startsWith("L_give_tool_") && it.requirements)
    .reduce((acc, it) => {
        const id = Object.keys(it.requirements)[0]
        const bonus = it.mutations
            .filter(it => it.mutateAspectId !== "follower_honoured" && it.mutateAspectId !== "resentment")
            .reduce((acc, it) => {
                acc[it.mutateAspectId] = it.mutationLevel
                return acc
            }, {})
        acc[id] = {
            description: it.description,
            bonus: bonus
        }
        return acc
    }, {})

const tools = readResource("/elements/tools.json").elements
    .filter(it => it.id !== "dropzone")
    .reduce((acc, it) => {
        const tool = {
            label: it.label,
            description: it.description,
            aspects: it.aspects
        }
        const gift = toolGifts[it.id]
        if (gift) {
            tool.gift = gift
        }
        if (it.unique) tool.unique = true

        acc[it.id] = tool
        return acc
    }, {})

console.log(toLuaTable(tools))
