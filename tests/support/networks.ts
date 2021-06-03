import { ethers } from 'ethers'

export const networks = [
  {
    name: 'BSC',
    id: Cypress.env('test_env') === 'dev' ? 97 : 56,
    tokens: [
      {
        name: 'BNB',
        id: 'ETH',
      },
      {
        name: 'DAI',
        id:
          Cypress.env('test_env') === 'dev'
            ? '0x618549d304828C77dCb590d02e3641b03E6f4176'
            : '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
      },
      {
        name: 'BUSD',
        id:
          Cypress.env('test_env') === 'dev'
            ? '0x3e919A1284A374260D99276672D354fDe2a09Cc0'
            : '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      },
    ],
    onlyProdTokens: [
      {
        name: '1INCH',
        id: '0x111111111117dC0aa78b770fA6A738034120C302',
      },
      {
        name: 'ADA',
        id: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
      },
    ],
  },
  {
    name: 'HECO',
    id: Cypress.env('test_env') === 'dev' ? 256 : 128,
    tokens: [
      {
        name: 'HT',
        id: 'ETH',
      },

      {
        name: 'UNI',
        id:
          Cypress.env('test_env') === 'dev'
            ? '0x0A81c899EEacf64c5D1EA4418B82Dd6C8E22154d'
            : '0x22C54cE8321A4015740eE1109D9cBc25815C46E6',
      },
      {
        name: 'USDT',
        id:
          Cypress.env('test_env') === 'dev'
            ? '0x6e4Dc12aF5477fCE40F87841dAfdf7156722635e'
            : '0xa71EdC38d189767582C38A3145b5873052c3e47a',
      },
    ],
    onlyProdTokens: [
      {
        name: '1INCH',
        id: '0xD192f8e3224Ff0f48B08DB4791576B6878B426A0',
      },
      {
        name: 'AAVE',
        id: '0x202b4936fE1a82A4965220860aE46d7d3939Bb25',
      },
    ],
  },
]
