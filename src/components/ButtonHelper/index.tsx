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
}

const ButtonHelper = ({ onClick = () => undefined, children }: Props): React.ReactElement => {
  return (
    <UnStyledButton onClick={onClick} type={'button'}>
      {children}
    </UnStyledButton>
  )
}

export default ButtonHelper
