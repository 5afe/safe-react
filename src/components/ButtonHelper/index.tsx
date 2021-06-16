import React, { ReactElement } from 'react'
import styled from 'styled-components'

const UnStyledButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline-color: ${({ theme }) => theme.colors.icon};
  display: flex;
  align-items: center;
`
type Props = {
  onClick?: () => void
  children: ReactElement
  dataTestId?: string
}

const ButtonHelper = ({ onClick = () => undefined, children, dataTestId }: Props): React.ReactElement => {
  return (
    <UnStyledButton onClick={onClick} type={'button'} data-testid={dataTestId}>
      {children}
    </UnStyledButton>
  )
}

export default ButtonHelper
