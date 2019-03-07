const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const obstacleRecipes = [
    readResource("/recipes/explore_obstacles_curses.json"),
    readResource("/recipes/explore_obstacles_guardians.json"),
    readResource("/recipes/explore_obstacles_perils.json"),
    readResource("/recipes/explore_obstacles_seals.json")
]
    .reduce((acc, it) => acc.concat(it.recipes), [])
    .reduce((acc, it) => {
        acc[it.id] = it
        return acc
    }, {})


const vaultLocks = readResource("/elements/vault_locks.json").elements
    .filter(it => !it.icon)
    .reduce((acc, lock) => {
        const requirements = Object.values(obstacleRecipes)
            .find(recipe => recipe.requirements && recipe.requirements[lock.id])
            .alternativerecipes
            .map(it => Object.keys(obstacleRecipes[it.id].requirements)[0])
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort()

        acc[lock.id] = {
            label: lock.label,
            description: lock.description,
            aspect: Object.keys(lock.aspects)[0],
            requirements: requirements
        };
        return acc
    }, {})

console.log(toLuaTable(vaultLocks))
