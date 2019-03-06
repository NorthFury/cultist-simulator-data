const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const loreBooks = readResource("/elements/books_lore.json").elements
const languageBooks = readResource("/elements/books_language.json").elements
const otherBooks = readResource("/elements/books_other.json").elements
const allBooks = loreBooks.concat(languageBooks, otherBooks)
const untranslatedBooks = readResource("/elements/books_untranslated.json").elements
const studyBookRecipes = readResource("/recipes/study_1_books.json").recipes

untranslatedBooks.forEach(untranslatedBook => {
    const book = allBooks.find(it => it.id === Object.values(untranslatedBook.xtriggers)[0])
    book.aspects[Object.keys(untranslatedBook.aspects).find(it => it !== "text" && it.startsWith("text"))] = 1
    book.untranslatedDescription = untranslatedBook.description
})

studyBookRecipes.forEach(recipe => {
    const bookId = Object.keys(recipe.requirements)[0]
    const book = allBooks.find(it => it.id === bookId)
    book.startDescription = recipe.startdescription
    book.endDescription = recipe.description
    Object.keys(recipe.effects).forEach(key => {
        if (recipe.effects[key] === -1) delete recipe.effects[key]
    })
    book.rewards = Object.keys(recipe.effects).filter(it => recipe.effects[it] !== -1)
})

const allBooksObject = allBooks.reduce((acc, it) => {
    const copy = Object.assign({}, it)
    acc[it.id] = copy
    delete copy.id
    return acc
}, {})

console.log(toLuaTable(allBooksObject))
