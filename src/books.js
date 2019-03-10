const toLuaTable = require("./util/toLuaTable")
const readResource = require("./util/readResource")

const loreBooks = readResource("/elements/books_lore.json").elements
const languageBooks = readResource("/elements/books_language.json").elements
const otherBooks = readResource("/elements/books_other.json").elements
const allBooks = loreBooks.concat(languageBooks, otherBooks)
const untranslatedBooks = readResource("/elements/books_untranslated.json").elements
const studyBookRecipes = readResource("/recipes/study_1_books.json").recipes

function trimGameHints(text) {
    text = text.trim()
    if (!text.endsWith("]") && !text.endsWith("].")) return text

    let index = text.lastIndexOf("[", text.length - 3)
    return text.substring(0, index).trim()
}

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

untranslatedBooks.forEach(untranslatedBook => {
    const book = allBooks.find(it => it.id === Object.values(untranslatedBook.xtriggers)[0])
    book.aspects[Object.keys(untranslatedBook.aspects).find(it => it !== "text" && it.startsWith("text"))] = 1
    book.untranslatedDescription = trimGameHints(untranslatedBook.description)
    //book.translatedId = book.id
    book.id = untranslatedBook.id
})

const allBooksObject = allBooks.reduce((acc, it) => {
    const copy = Object.assign({}, it)
    delete copy.id
    copy.description = trimGameHints(copy.description)
    acc[it.id] = copy
    return acc
}, {})

console.log(toLuaTable(allBooksObject))
