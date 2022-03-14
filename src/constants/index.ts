import { ChainId, Token, WETH } from '@gravis.finance/sdk'

import { ChainIdType } from 'constants/chain'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainIdType]: Token[]
}

//  BSC Mainnet Basic Tokens
export const GRVX = new Token(
  ChainId.MAINNET,
  '0xa349fd455a457467d31ca8db59052daebbbcc108',
  18,
  'GRVX',
  'Dai Stablecoin'
)
export const DAI = new Token(ChainId.MAINNET, '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', 18, 'DAI', 'Dai Stablecoin')
export const BUSD = new Token(ChainId.MAINNET, '0xe9e7cea3dedca5984780bafc599bd69add087d56', 18, 'BUSD', 'Binance USD')
export const USDT = new Token(ChainId.MAINNET, '0x55d398326f99059ff775485246999027b3197955', 18, 'USDT', 'Tether USD')
export const ETH = new Token(
  ChainId.MAINNET,
  '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
  18,
  'ETH',
  'Binance-Peg Ethereum Token'
)

// BSC Testnet Basic Tokens
export const TEST_BSC_WBNB = new Token(
  ChainId.BSCTESTNET,
  '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
  18,
  'WBNB',
  'Wrapped BNB'
)
export const TEST_BSC_GRVX = new Token(
  ChainId.BSCTESTNET,
  '0x0eb3578904eec144a2daf123a856ee8018124fc7',
  18,
  'GRVX',
  'GRVX'
)
export const TEST_BSC_USDT = new Token(
  ChainId.BSCTESTNET,
  '0x1138ebb3101f557b28326a28b6f192c7fecc95f7',
  18,
  'USDT',
  'USDT'
)
export const TEST_BSC_DAI = new Token(
  ChainId.BSCTESTNET,
  '0x618549d304828c77dcb590d02e3641b03e6f4176',
  18,
  'DAI',
  'DAI'
)
export const TEST_BSC_USDC = new Token(
  ChainId.BSCTESTNET,
  '0x4a291477C8901672BCa0E4d2bF391587276A4a37',
  18,
  'USDC',
  'USD Coin'
)
export const TEST_BSC_BUSD = new Token(
  ChainId.BSCTESTNET,
  '0x3e919a1284a374260d99276672d354fde2a09cc0',
  18,
  'BUSD',
  'BUSD'
)
export const TEST_BSC_WETH = new Token(
  ChainId.BSCTESTNET,
  '0x12BE304f9b7a3B624213b5DBaC1822F75E005DAF',
  18,
  'WETH',
  'WETH Token'
)

//  HECO Mainnet Basic Tokens
export const HECO_USDT = new Token(
  ChainId.HECOMAINNET,
  '0xa71edc38d189767582c38a3145b5873052c3e47a',
  18,
  'USDT',
  'Tether USD'
)
export const HECO_ETH = new Token(
  ChainId.HECOMAINNET,
  '0x64ff637fb478863b7468bc97d30a5bf3a428a1fd',
  18,
  'ETH',
  'HECO-Peg Ethereum Token'
)

// HECO Testnet Basic Tokens
export const TEST_HECO_WHT = new Token(
  ChainId.HECOTESTNET,
  '0x7aF326B6351C8A9b8fb8CD205CBe11d4Ac5FA836',
  6,
  'WHT',
  'Wrapped HT'
)
export const TEST_HECO_USDT = new Token(
  ChainId.HECOTESTNET,
  '0x6e4Dc12aF5477fCE40F87841dAfdf7156722635e',
  6,
  'USDT',
  'USDT'
)
export const TEST_HECO_USDC = new Token(
  ChainId.HECOTESTNET,
  '0x9a33Ddd074Cd1275DCF6aDe8920675FD8fade75E',
  6,
  'USDC',
  'USDC'
)
export const TEST_HECO_DAI = new Token(
  ChainId.HECOTESTNET,
  '0xc73cbC85C8Df0e7b40Cc05f8B82De4a7ae8F8813',
  18,
  'DAI',
  'DAI'
)
export const TEST_HECO_WBTC = new Token(
  ChainId.HECOTESTNET,
  '0x7bA4b2383255b891D51D1702023904dcEf6d952a',
  8,
  'WBTC',
  'Wrapped BTC'
)
export const TEST_HECO_UNI = new Token(
  ChainId.HECOTESTNET,
  '0x6e4Dc12aF5477fCE40F87841dAfdf7156722635e',
  18,
  'UNI',
  'UNI'
)

// MATIC Mainnet Basic Tokens
export const MATIC_GRVX = new Token(
  ChainId.MATICMAINNET,
  '0xD322da59C420E0827e31C40f1886346FB19c6687',
  18,
  'GRVX',
  'GRAVIS X TOKEN'
)
export const MATIC_DAI = new Token(
  ChainId.MATICMAINNET,
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  18,
  'DAI',
  'Dai Stablecoin'
)
export const MATIC_USDC = new Token(
  ChainId.MATICMAINNET,
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  6,
  'USDC',
  'USDC Coin'
)
export const MATIC_USDT = new Token(
  ChainId.MATICMAINNET,
  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  6,
  'USDT',
  'Tether USD'
)
export const MATIC_WETH = new Token(
  ChainId.MATICMAINNET,
  '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  18,
  'WETH',
  'Wrapped Ether'
)
export const MATIC_IRON = new Token(
  ChainId.MATICMAINNET,
  '0xD86b5923F3AD7b585eD81B448170ae026c65ae9a',
  18,
  'IRON',
  'IRON Stablecoin'
)

// MATIC Testnet Basic Tokens
export const TEST_MATIC_WMATIC = new Token(
  ChainId.MATICTESTNET,
  '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
  18,
  'WMATIC',
  'Wrapped Matic'
)
export const TEST_MATIC_USDT = new Token(
  ChainId.MATICTESTNET,
  '0x3E823a0A1a471Dac708Cd819f857cd703648644C',
  18,
  'USDT',
  'USDT'
)
export const TEST_MATIC_USDC = new Token(
  ChainId.MATICTESTNET,
  '0x0020Ef42Ec72A901c48Df446cCBC866e64b17fDd',
  18,
  'USDC',
  'USDC'
)
export const TEST_MATIC_DAI = new Token(
  ChainId.MATICTESTNET,
  '0x74dB81ee72b471c175E115993F929B113151C85d',
  18,
  'DAI',
  'DAI'
)
export const TEST_MATIC_WBTC = new Token(
  ChainId.MATICTESTNET,
  '0x15f52f35DC0E68514Bdb442F8021D7860e766a80',
  18,
  'WBTC',
  'Wrapped BTC'
)
export const TEST_MATIC_UNI = new Token(
  ChainId.MATICTESTNET,
  '0xa87424a801444B9282F0B1351d7F65128e8D4159',
  18,
  'UNI',
  'UNI'
)

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.BSCTESTNET]: [WETH[ChainId.BSCTESTNET]],
  [ChainId.HECOMAINNET]: [WETH[ChainId.HECOMAINNET]],
  [ChainId.HECOTESTNET]: [WETH[ChainId.HECOTESTNET]],
  [ChainId.MATICMAINNET]: [Object.assign(WETH[ChainId.MATICMAINNET], { symbol: 'WMATIC' })],
  [ChainId.MATICTESTNET]: [Object.assign(WETH[ChainId.MATICTESTNET], { symbol: 'WMATIC' })],
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT, ETH],
  [ChainId.BSCTESTNET]: [TEST_BSC_DAI, TEST_BSC_USDC, TEST_BSC_USDT, TEST_BSC_BUSD],
  [ChainId.HECOMAINNET]: [...WETH_ONLY[ChainId.HECOMAINNET], HECO_USDT, HECO_ETH],
  [ChainId.HECOTESTNET]: [TEST_HECO_DAI, TEST_HECO_USDT, TEST_HECO_USDC],
  [ChainId.MATICMAINNET]: [
    ...WETH_ONLY[ChainId.MATICMAINNET],
    MATIC_DAI,
    MATIC_USDT,
    MATIC_USDC,
    MATIC_IRON,
    MATIC_WETH,
  ],
  [ChainId.MATICTESTNET]: [TEST_MATIC_DAI, TEST_MATIC_USDT, TEST_MATIC_USDC],
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {},
  [ChainId.BSCTESTNET]: {},
  [ChainId.HECOMAINNET]: {},
  [ChainId.HECOTESTNET]: {},
  [ChainId.MATICMAINNET]: {},
  [ChainId.MATICTESTNET]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [GRVX, ...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT],
  [ChainId.BSCTESTNET]: [
    TEST_BSC_GRVX,
    ...WETH_ONLY[ChainId.BSCTESTNET],
    TEST_BSC_DAI,
    TEST_BSC_USDC,
    TEST_BSC_USDT,
    TEST_BSC_BUSD,
  ],
  [ChainId.HECOMAINNET]: [...WETH_ONLY[ChainId.HECOMAINNET], HECO_USDT, HECO_ETH],
  [ChainId.HECOTESTNET]: [
    ...WETH_ONLY[ChainId.HECOTESTNET],
    TEST_HECO_DAI,
    TEST_HECO_USDC,
    TEST_HECO_USDT,
    TEST_HECO_WBTC,
    TEST_HECO_UNI,
  ],
  [ChainId.MATICMAINNET]: [
    MATIC_GRVX,
    ...WETH_ONLY[ChainId.MATICMAINNET],
    MATIC_DAI,
    MATIC_USDT,
    MATIC_USDC,
    MATIC_WETH,
  ],
  [ChainId.MATICTESTNET]: [...WETH_ONLY[ChainId.MATICTESTNET], TEST_MATIC_DAI, TEST_MATIC_USDT, TEST_MATIC_USDC],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, BUSD, USDT],
  [ChainId.BSCTESTNET]: [...WETH_ONLY[ChainId.BSCTESTNET], TEST_BSC_DAI, TEST_BSC_USDC, TEST_BSC_USDT, TEST_BSC_BUSD],
  [ChainId.HECOMAINNET]: [...WETH_ONLY[ChainId.HECOMAINNET], HECO_USDT, HECO_ETH],
  [ChainId.HECOTESTNET]: [...WETH_ONLY[ChainId.HECOTESTNET], TEST_HECO_DAI, TEST_HECO_USDC, TEST_HECO_USDT],
  [ChainId.MATICMAINNET]: [
    ...WETH_ONLY[ChainId.MATICMAINNET],
    MATIC_DAI,
    MATIC_USDT,
    MATIC_USDC,
    MATIC_IRON,
    MATIC_WETH,
  ],
  [ChainId.MATICTESTNET]: [...WETH_ONLY[ChainId.MATICTESTNET], TEST_MATIC_DAI, TEST_MATIC_USDT, TEST_MATIC_USDC],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82', 18, 'CAKE', 'PancakeSwap Token'),
      new Token(ChainId.MAINNET, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
    ],
    [BUSD, USDT],
    [DAI, USDT],
  ],
  [ChainId.BSCTESTNET]: [
    [TEST_BSC_WBNB, TEST_BSC_DAI],
    [TEST_BSC_WBNB, TEST_BSC_USDT],
    [TEST_BSC_WBNB, TEST_BSC_USDC],
    [TEST_BSC_WBNB, TEST_BSC_BUSD],
    [TEST_BSC_USDT, TEST_BSC_DAI],
    [TEST_BSC_USDT, TEST_BSC_USDC],
    [TEST_BSC_USDT, TEST_BSC_BUSD],
    [TEST_BSC_DAI, TEST_BSC_BUSD],
    [TEST_BSC_DAI, TEST_BSC_USDC],
  ],
  [ChainId.HECOMAINNET]: [[HECO_USDT, HECO_ETH]],
  [ChainId.HECOTESTNET]: [
    [TEST_HECO_DAI, TEST_HECO_USDT],
    [TEST_HECO_DAI, TEST_HECO_USDC],
  ],
  [ChainId.MATICMAINNET]: [
    [MATIC_DAI, MATIC_USDT],
    [MATIC_DAI, MATIC_USDC],
    [MATIC_USDT, MATIC_USDC],
    [MATIC_USDT, MATIC_IRON],
    [MATIC_USDC, MATIC_IRON],
    [MATIC_IRON, MATIC_DAI],
  ],
  [ChainId.MATICTESTNET]: [
    [TEST_MATIC_DAI, TEST_MATIC_USDT],
    [TEST_MATIC_DAI, TEST_MATIC_USDC],
    [TEST_MATIC_USDT, TEST_MATIC_USDC],
  ],
}
