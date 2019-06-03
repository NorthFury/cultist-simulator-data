const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const expeditions = [
    readResource("/recipes/explore_vaults_a_capital.json"),
    readResource("/recipes/explore_vaults_b_shires.json"),
    readResource("/recipes/explore_vaults_c_continent.json"),
    readResource("/recipes/explore_vaults_d_landbeyondforest.json"),
    readResource("/recipes/explore_vaults_e_rendingmountains.json"),
    readResource("/recipes/explore_vaults_f_loneandlevelsands.json"),
    readResource("/recipes/explore_vaults_g_eveningisles.json"),
    readResource("/recipes/explore_vaults_h_floating.json"),
].reduce((acc, it) => acc.concat(it.recipes), [])

const vaults = readResource("/elements/vaults.json").elements.reduce((acc, vault) => {
    const setup = expeditions.find(it => it.craftable && Object.keys(it.requirements).includes(vault.id))
    const success = expeditions.find(it => !it.craftable && Object.keys(it.requirements).includes(vault.id))

    const rewards = ((success.internaldeck || {}).spec || []).reduce((acc, it) => {
        acc[it] = 1
        return acc
    }, {})
    if (success.effects.funds) rewards.funds = success.effects.funds

    const data = {
        label: vault.label.replace(/\s\s/g, " "),
        unique: vault.unique,
        description: vault.description,
        startDescription: setup.startdescription.substring(0, setup.startdescription.length - 144),
        successDescription: success.startdescription,
        endDescription: success.description,
        obstacles: Object.keys(setup.effects),
        rewards: rewards,
        randomRewards: success.deckeffect,
        location: Object.keys(vault.aspects).find(it => it !== "vault" && it !== "location")
    }

    if (!data.unique) delete data.unique
    if (!data.location) delete data.location
    if (!data.randomRewards) delete data.randomRewards

    acc[vault.id] = data
    return acc
}, {})

console.log(toLuaTable(vaults))
