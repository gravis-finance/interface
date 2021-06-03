import React from 'react'
import styled from 'styled-components'
import { CheckMarkDoneIcon } from '@gravis.finance/uikit'
import { RowBetween } from '../Row'
import { AutoColumn } from '../Column'

const Wrapper = styled(AutoColumn)`
  margin-top: 1.25rem;
`

const Grouping = styled(RowBetween)<{ groupingWidth?: boolean }>`
  width: ${({ groupingWidth }) => (groupingWidth ? '72%' : '50%')};
  @media screen and (max-width: 530px) {
    width: 100% !important;
  }
`

const Circle = styled.div<{ confirmed?: boolean; disabled?: boolean }>`
  min-width: 24px;
  min-height: 24px;
  background-color: ${({ theme, confirmed }) => (confirmed ? '#1EA76D;' : theme.colors.primary)};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 8px;
  font-size: 12px;
  ${({ disabled }) => (disabled ? 'background-color: #303030;' : '')}
  color: #ffffff;
  position: relative;
`

const CircleRow = styled.div`
  width: calc(100% - 20px);
  display: flex;
  align-items: center;
`

const Connector = styled.div<{ prevConfirmed?: boolean }>`
  width: 100%;
  height: 1px;
  background: ${({ prevConfirmed }) =>
    prevConfirmed
      ? 'linear-gradient(270deg, #009CE1 2.52%, #1EA76D 100%)'
      : 'linear-gradient(270deg, #494949 43.95%, #009CE1 100%);max-width: 738px'};
  margin: 0 8px;
`

const StyledCheckMark = styled(CheckMarkDoneIcon)`
  background-color: #ffffff;
  position: absolute;
  border-radius: 5px;
  right: -5px;
  top: -5px;
`

interface ProgressCirclesProps {
  steps: boolean[]
  groupingWidth?: boolean
}

/**
 * Based on array of steps, create a step counter of circles.
 * A circle can be enabled, disabled, or confirmed. States are derived
 * from previous step.
 *
 * An extra circle is added to represent the ability to swap, add, or remove.
 * This step will never be marked as complete (because no 'txn done' state in body ui).
 *
 * @param steps  array of booleans where true means step is complete
 */
// CheckMarkDoneIcon
export default function ProgressCircles({ steps, groupingWidth }: ProgressCirclesProps) {
  return (
    <Wrapper justify="center">
      <Grouping groupingWidth={groupingWidth}>
        {steps.map((step, i) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <CircleRow key={i}>
              <Circle confirmed={step} disabled={!steps[i - 1] && i !== 0}>
                {step && <StyledCheckMark width="12" height="12" />}
                {i + 1}
              </Circle>
              <Connector prevConfirmed={step} />
            </CircleRow>
          )
        })}
        <Circle disabled={!steps[steps.length - 1]}>{steps.length + 1}</Circle>
      </Grouping>
    </Wrapper>
  )
}
