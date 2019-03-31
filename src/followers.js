const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")
const trimGameHints = require("./util/trimGameHints")

function groupByFollower(description) {
    return description.substring(1, description.length - 1)
        .split("#")
        .splice(1)
        .reduce((acc, it) => {
            const [id, description] = it.split("|")
            acc[id] = description.trim()
            return acc
        }, {})
}

const romanceStart = readResource("/recipes/talking_8_follower.json").recipes
    .filter(it => it.requirements && it.requirements.romanticinterest === -1 && it.linked)
    .reduce((acc, it) => {
        const id = Object.keys(it.requirements).find(it => it.startsWith("follower"))
        const locationId = Object.keys(it.requirements).find(it => it !== id && it !== "romanticinterest")
        acc[id] = {
            locationId,
            label: it.label,
            description: trimGameHints(it.description || ""),
            descriptions: groupByFollower(it.startdescription)
        }
        return acc
    }, {})

const romanceEnd = readResource("/recipes/talk_l_romance.json").recipes
    .filter(it => it.mutations &&
        it.mutations.some(it => it.mutateAspectId === "romanticinterest" && it.mutationLevel > 0)
    )
    .reduce((acc, it) => {
        const id = Object.keys(it.requirements).find(it => it.startsWith("follower"))
        const bonus = it.mutations
            .filter(it => it.mutateAspectId !== "romanticinterest")
            .reduce((acc, it) => {
                acc[it.mutateAspectId] = it.mutationLevel
                return acc
            }, {})

        acc[id] = {
            label: it.label,
            descriptions: groupByFollower(it.startdescription),
            bonus
        }
        return acc
    }, {})

const followers = readResource("/elements/followers.json").elements
    .filter(it => it.uniquenessgroup) // only keep disciples that can be exalted
    .reduce((acc, it) => {
        const id = it.uniquenessgroup
        acc[id] = acc[id] || []
        acc[id].push(it)

        delete it.xtriggers
        delete it.animFrames
        delete it.uniquenessgroup

        return acc
    }, {})

// filter out all that don't start as an acquaintance
Object.keys(followers).forEach(id => {
    if (followers[id].length < 5) delete followers[id]
})

const hiddenAspects = readResource("/elements/_aspects.json").elements
    .filter(it => it.isHidden)
    .map(it => it.id)
    .reduce((acc, it) => {
        acc[it] = true
        return acc
    }, {})
function filterOutHiddenAspects(aspects) {
    return Object.keys(aspects).reduce((acc, aspect) => {
        if (!hiddenAspects[aspect]) acc[aspect] = aspects[aspect]
        return acc
    }, {})
}

const aggregatedFollowers = Object.keys(followers).reduce((acc, id) => {
    const versions = followers[id]
    const acquaintance = versions.find(it => it.aspects.acquaintance)
    const follower = versions.find(it => it.aspects.follower && !it.aspects.disciple && !it.aspects.exalted)
    const disciple = versions.find(it => it.aspects.disciple && !it.aspects.exalted)
    const exalted = versions.find(it => it.aspects.exalted)
    const prisoner = versions.find(it => it.aspects.prisoner)

    const romanceId = Object.keys(follower.aspects).find(it => it.startsWith("follower_"))
    const start = romanceStart[romanceId]
    const end = romanceEnd[romanceId]

    function trimVersion(version) {
        return {
            label: version.label,
            description: version.description,
            aspects: filterOutHiddenAspects(version.aspects)
        }
    }
    acc[id] = {
        acquaintance: trimVersion(acquaintance),
        follower: trimVersion(follower),
        disciple: trimVersion(disciple),
        exalted: trimVersion(exalted),
        prisoner: trimVersion(prisoner),
        romance: {
            locationId: start.locationId,
            inviteDescription: start.description,
            startDescription: start.descriptions[id],
            endDescription: end.descriptions[id],
            bonus: end.bonus
        }
    }
    return acc
}, {})

console.log(toLuaTable(aggregatedFollowers))
