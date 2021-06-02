import React from 'react'
// @ts-ignore
import { Text, BorderedArrowDownIcon } from '@gravis.finance/uikit'

import styled from 'styled-components'
import { RowFixed } from '../Row'

export const FilterWrapper = styled(RowFixed)`
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
`

interface StyledAscendingButtonProps {
  reversed?: boolean
}

const StyledAscendingButton = styled.div`
  line-height: 0;
  transition: transform 200ms ease-in-out;
  ${(props: StyledAscendingButtonProps) => props.reversed && 'transform: rotate(180deg)'}
`

export default function SortButton({
  toggleSortOrder,
  ascending,
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder} data-id="sort-button">
      <Text fontSize="14px">
        {ascending ? (
          <StyledAscendingButton reversed>
            <BorderedArrowDownIcon />
          </StyledAscendingButton>
        ) : (
          <StyledAscendingButton>
            <BorderedArrowDownIcon />
          </StyledAscendingButton>
        )}
      </Text>
    </FilterWrapper>
  )
}
