import { useQuery } from 'react-query'

const BRIDGE_DATA_KEY = 'BRIDGE_DATA_KEY'

const BRIDGE_DATA_URL = `${process.env.REACT_APP_ASSETS_API_URL}/bridge/transfers`

const fetchBridgeData = async () => {
  const result = await fetch(BRIDGE_DATA_URL).then((res) => res.json())

  return result.data.reduce(
    (acc, { transfers }) => acc + parseFloat(transfers),
    0
  )
}

const useBridgeData = () => {
  return useQuery(BRIDGE_DATA_KEY, fetchBridgeData)
}

export default useBridgeData
