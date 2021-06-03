import React from 'react'
import styled from 'styled-components'
import { Heading, LogoIcon } from '@gravis.finance/uikit'
import { useTranslation } from 'react-i18next'

const StyledCardHeader = styled.div`
  padding: 26px 24px;
`

const ComingSoon = () => {

  const { t } = useTranslation()

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
        {t('comingSoon')}
      </Heading>
    </StyledCardHeader>
  )
}

export default ComingSoon
