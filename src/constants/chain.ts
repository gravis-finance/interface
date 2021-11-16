import { ChainId } from '@gravis.finance/sdk'

export type ChainIdType = Exclude<ChainId, ChainId.ETHEREUMMAINNET | ChainId.ETHEREUMTESTNET>
