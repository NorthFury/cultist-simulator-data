function toLuaTable(o, indent = "") {
  switch (typeof o) {
    case "boolean":
    case "number":
      return o
    case "string":
      return '"' + o + '"'
    case "object":
      var result = '{\n'
      const newIndent = indent + '  '
      if (Array.isArray(o)) {
        if (o.length === 0) return "{}"
        result += o.map(it => newIndent + toLuaTable(it, newIndent)).join(',\n')
      } else {
        const keys = Object.keys(o)
        if (keys.length === 0) return "{}"

        const validProperty = /^[a-z][a-z0-9]*$/i
        result += keys.map(name => {
          var property
          if (validProperty.test(name)) property = name
          else property = '["' + name + '"]'
          return newIndent + property + ' = ' + toLuaTable(o[name], newIndent)
        }).join(',\n')
      }
      result += '\n' + indent + '}'
      return result
  }
}

module.exports = toLuaTable