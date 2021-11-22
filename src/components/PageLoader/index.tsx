import React from 'react'
import styled from 'styled-components'
import { Spinner } from '@gravis.finance/uikit'

import Page from '../layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: #262626;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Spinner size={80} />
    </Wrapper>
  )
}

export default PageLoader
