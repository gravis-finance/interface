import {
  DATA_LAYER_EVENTS,
  DATA_LAYER_VALUE_KEYS
} from 'constants/data-layer-events'

export const addDataLayerEvent = (event: DATA_LAYER_EVENTS, value?: any) => {
  let { dataLayer } = (window as any)
  dataLayer = dataLayer || []
  const dataLayerItem = value ?
    { event, [DATA_LAYER_VALUE_KEYS[event]]: value } :
    { event }
  dataLayer.push(dataLayerItem)
}

export default null
