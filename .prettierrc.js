const package = require('./package.json')

const deps = Object.keys(package.dependencies).join('|')

module.exports = {
  semi: false,
  singleQuote: true,
  printWidth: 80,
  bracketSpacing: true,
  importOrder: [deps, '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  trailingComma: 'none'
}
