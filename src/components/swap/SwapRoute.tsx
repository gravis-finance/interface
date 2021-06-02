import { Trade } from '@gravis.finance/sdk'
import React, { Fragment, memo } from 'react'
import { ChevronRight } from 'react-feather'
import { Flex } from '@gravis.finance/uikit'

import styled from 'styled-components'
import { TYPE } from '../Shared'
import CurrencyLogo from '../Logos/CurrencyLogo'

const { black: Black } = TYPE

const StyledFlex = styled(Flex)`
  > img {
    border-radius: 16px;
  }
  > svg {
    border-radius: 16px;
  }
`

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  return (
    <Flex
      px="1rem"
      py="0.5rem"
      my="0.5rem"
      style={{ border: `1px solid rgba(255, 255, 255, 0.05)`, borderRadius: '6px' }}
      flexWrap="wrap"
      justifyContent="space-between"
      alignItems="center"
    >
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            <StyledFlex my="0.5rem" alignItems="center" style={{ flexShrink: 0 }}>
              <CurrencyLogo currency={token} />
              <Black fontSize={14} color="#909090" ml="0.5rem">
                {token.symbol}
              </Black>
            </StyledFlex>
            {isLastItem ? null : <ChevronRight color="#909090" />}
          </Fragment>
        )
      })}
    </Flex>
  )
})
