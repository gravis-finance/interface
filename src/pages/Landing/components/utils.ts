export const getMarketCap = (
  total: string | undefined,
  price: number | undefined
) => (total && price ? (parseFloat(total) * price).toFixed() : undefined)
