module.exports = {
  presets: [
    '@babel/preset-env',
    [
      '@babel/preset-typescript',
      {
        allExtensions: true,
        isTSX: true,
      },
    ],
  ],
  plugins: [
    [
      'parse-translation',
      {
        localesPath: './public/locales',
        unknownKeys: {
          't(`${getExplorerName(chainId)}`)': ['viewOnBscscan', 'viewOnHecoInfo', 'MaticInfo'],
        },
      },
    ],
  ],
}
