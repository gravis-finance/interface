import React from 'react'
import { HelpIcon, FilledHelp, BigHelpIcon, Tooltip } from '@gravis.finance/uikit'
import styled from 'styled-components'

const QuestionWrapper = styled.div<{ bordered?: boolean; big?: boolean; empty?: boolean; disableHover?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  color: ${({ theme }) => theme.colors.textSubtle};

  ${({ bordered }) =>
    bordered
      ? `
    border: 1px solid #D2D6E5;
    box-sizing: border-box;
    border-radius: 6px;
    width: 40px;
    height: 40px;
  `
      : ''}

  ${({ big }) =>
    big
      ? `
      background: linear-gradient(90.28deg, #292929 0%, #242424 100%);
      border: 1px solid #2E2E2E;
      box-sizing: border-box;
      box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.4), -4px -4px 12px rgba(255, 255, 255, 0.05);
      border-radius: 33px;
      padding: 6px;
    `
      : ''}
    ${({ disableHover, big }) =>
    !disableHover && big
      ? `
      :hover {
        background: linear-gradient(90.28deg, #242424 0%, #202020 100%), #D2D6E5;
        border: 1px solid #2E2E2E;
      }`
      : ''}
    ${({ empty }) => (empty ? 'background: transparent; border: none; box-shadow: none;' : '')}
`

const StyledTooltip = styled(Tooltip)`
  width: 228px;
`

const hiddenIconStyles: React.CSSProperties = {
  position: 'absolute',
  width: 0,
  height: 0,
}

export default function QuestionHelper({
  text,
  big,
  ...restProps
}: {
  text: string
  bordered?: boolean
  big?: boolean
  empty?: boolean
  disableHover?: boolean
}) {
  const [isMouseOver, setIsMouseOver] = React.useState(false)

  return (
    <span style={{ marginLeft: 4 }}>
      <StyledTooltip title={text}>
        <QuestionWrapper
          big={big}
          {...restProps}
          onMouseOver={() => setIsMouseOver(true)}
          onMouseLeave={() => setIsMouseOver(false)}
        >
          {!big ? (
            <>
              <HelpIcon style={isMouseOver ? hiddenIconStyles : undefined} />
              <FilledHelp style={isMouseOver ? undefined : hiddenIconStyles} />
            </>
          ) : (
            <BigHelpIcon />
          )}
        </QuestionWrapper>
      </StyledTooltip>
    </span>
  )
}
