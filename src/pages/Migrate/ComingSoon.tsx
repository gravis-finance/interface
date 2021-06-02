import React from 'react'
import styled from 'styled-components'
import { Heading, LogoIcon } from '@gravis.finance/uikit'

const StyledCardHeader = styled.div`
  padding: 26px 24px;
`

const ComingSoon = () => {
  return (
    <StyledCardHeader>
      <Heading
        color="text"
        style={{
          fontSize: '18px',
          letterSpacing: '0.1px',
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LogoIcon style={{ marginRight: '12px' }} />
        Coming soon
      </Heading>
    </StyledCardHeader>
  )
}

export default ComingSoon
