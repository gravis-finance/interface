import { ChainId } from '@gravis.finance/sdk'

import { ChainIdType } from 'constants/chain'

const MULTICALL_ADDRESS: { [chainId in ChainIdType]: string } = {
  [ChainId.MAINNET]: '0x1Ee38d535d541c55C9dae27B12edf090C608E6Fb',
  [ChainId.BSCTESTNET]: '0x020b5158443287a8C5366e81BC70ecEEdb8d7FC2',
  [ChainId.HECOMAINNET]: '0x970F84Ce98f4804d5519e5Ab515340B5BAe5a2DB',
  [ChainId.HECOTESTNET]: '0x4763395a9eb252bb509ac78dc409d64b1d9d1b84',
  [ChainId.MATICMAINNET]: '0x61a624e41F0c28870F253fc899CD92690c2b29CD',
  [ChainId.MATICTESTNET]: '0xfD7C3bd8B14E45daC8CFC642f19e95d75EB1f8F2',
}

export default MULTICALL_ADDRESS
