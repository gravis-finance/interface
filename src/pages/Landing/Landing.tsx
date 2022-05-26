import { Text } from '@gravis.finance/uikit'
import React from 'react'
import styled from 'styled-components'

import Bridge from './components/Bridge'
import Farming from './components/Farming'
import FirstScreen from './components/FirstScreen'
import Footer from './components/Footer'
import GrowApr from './components/GrowApr'
import Header from './components/Header'
import OneClickLiquidity from './components/OneClickLiquidity'
import OurPartners from './components/OurPartners'
import Tokenomics from './components/Tokenomics'
import TradeAnything from './components/TradeAnything'
import TryOurProjects from './components/TryOurProjects'

const Container = styled.div`
  overflow-x: hidden;
  background-color: #080a15;

  ${Text} {
    font-family: Gilroy;
  }
`

const Landing: React.FC = () => {
  return (
    <Container>
      <Header />
      <FirstScreen />
      <TradeAnything />
      <Farming />
      <GrowApr />
      <Tokenomics />
      <Bridge />
      <OneClickLiquidity />
      <TryOurProjects />
      <OurPartners />
      <Footer />
    </Container>
  )
}

export default Landing
