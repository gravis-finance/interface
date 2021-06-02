import React, { lazy, Suspense } from 'react'
import gravisSpinnerJson from './gravisSpinnerJson.json'
import gravisSmallSpinnerJson from './gravisSmallSpinnerJson.json'

interface GravisSpinner {
  small?: boolean
}

const LazyLottie = lazy(() => import('react-lottie-player'))

const GravisSpinner = ({ small }: GravisSpinner) => {
  return (
    <Suspense fallback={null}>
      <LazyLottie
        loop
        animationData={!small ? gravisSpinnerJson : gravisSmallSpinnerJson}
        play
        style={small ? { width: '30px' } : {}}
      />
    </Suspense>
  )
}

export default GravisSpinner
