import React, { lazy, Suspense } from 'react'
import gravisSpinnerJson from './gravisSpinnerJson.json'
import gravisSmallSpinnerJson from './gravisSmallSpinnerJson.json'

interface GravisSpinner {
  width?: string
  small?: boolean
}

const LazyLottie = lazy(() => import('react-lottie-player'))

const GravisSpinner = ({ small, width = '88px' }: GravisSpinner) => {
  return (
    <Suspense fallback={null}>
      <LazyLottie
        loop
        animationData={!small ? gravisSpinnerJson : gravisSmallSpinnerJson}
        play
        style={small ? { width: '30px' } : {width}}
      />
    </Suspense>
  )
}

export default GravisSpinner
