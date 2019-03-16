function trimGameHints(text) {
    text = text.trim()
    if (!text.endsWith("]") && !text.endsWith("].")) return text

    let index = text.lastIndexOf("[", text.length - 3)
    return text.substring(0, index).trim()
}

module.exports = trimGameHints
