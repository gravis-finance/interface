import { ChainId } from '@gravis.finance/sdk'

const VAMPIRE_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0xAe3c67D35848D9f9375349e1E5667FF3079C0E55',
  [ChainId.BSCTESTNET]: '0xC93a47e2fA4B5BD6ACFE8f8AcD8fe68aC568919d',
  [ChainId.HECOMAINNET]: '0xAe3c67D35848D9f9375349e1E5667FF3079C0E55',
  [ChainId.HECOTESTNET]: '0xAe3c67D35848D9f9375349e1E5667FF3079C0E55',
  [ChainId.MATICMAINNET]: '0xAe3c67D35848D9f9375349e1E5667FF3079C0E55',
  [ChainId.MATICTESTNET]: '0xAe3c67D35848D9f9375349e1E5667FF3079C0E55',
}

export default VAMPIRE_ADDRESS
