import React, { ReactElement } from 'react'
import styled from 'styled-components'

const UnStyledButton = styled.button`
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s ease-in-out;
  outline-color: transparent;
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    background-color: ${({ theme }) => theme.colors.separator};
  }
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
