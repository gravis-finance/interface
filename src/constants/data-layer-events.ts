export enum DATA_LAYER_EVENTS {
  SWAP = 'Swap',
  ADD_LIQUIDITY = 'AddLiquidity',
  MIGRATE = 'Migrate'
}

export const DATA_LAYER_VALUE_KEYS = {
  [DATA_LAYER_EVENTS.ADD_LIQUIDITY]: 'AddLiquidityValue'
}
