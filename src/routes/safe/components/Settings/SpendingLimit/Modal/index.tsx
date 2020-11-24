import { Icon, Text, Title } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, ReactNode, ReactNodeArray } from 'react'
import styled from 'styled-components'

import GnoModal from 'src/components/Modal'
import { useStyles } from 'src/routes/safe/components/Settings/SpendingLimit/style'

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};
`

const StyledButton = styled.button`
  background: none;
  border: none;
  padding: 5px;
  width: 26px;
  height: 26px;

  span {
    margin-right: 0;
  }

  :hover {
    background: ${({ theme }) => theme.colors.separator};
    border-radius: 16px;
    cursor: pointer;
  }
`

const FooterSection = styled.div`
  border-top: 2px solid ${({ theme }) => theme.colors.separator};
  padding: 16px 24px;
`

const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

export interface TopBarProps {
  title: string
  titleNote?: string
  onClose: () => void
}

const TopBar = ({ title, titleNote, onClose }: TopBarProps): ReactElement => (
  <TitleSection>
    <Title size="xs" withoutMargin>
      {title}
      {titleNote && (
        <>
          {' '}
          <Text size="lg" color="secondaryLight" as="span">
            {titleNote}
          </Text>
        </>
      )}
    </Title>

    <StyledButton onClick={onClose}>
      <Icon size="sm" type="cross" />
    </StyledButton>
  </TitleSection>
)

interface FooterProps {
  children: ReactNodeArray
}

const Footer = ({ children }: FooterProps): ReactElement => (
  <FooterSection>
    <FooterWrapper>{children}</FooterWrapper>
  </FooterSection>
)

export interface ModalProps {
  children: ReactNode
  description: string
  handleClose: () => void
  open: boolean
  title: string
}

// TODO: this is a potential proposal for `safe-react-components` Modal
//  By being able to combine components for better flexibility, this way Buttons can be part of the form body
const Modal = ({ children, ...props }: ModalProps): ReactElement => {
  const classes = useStyles()

  return (
    <GnoModal {...props} paperClassName={classes.modal}>
      {children}
    </GnoModal>
  )
}

Modal.TopBar = TopBar
Modal.Footer = Footer

export default Modal
