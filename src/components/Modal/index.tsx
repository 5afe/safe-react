import { Icon, Text, Title } from '@gnosis.pm/safe-react-components'
import ModalMUI from '@material-ui/core/Modal'
import cn from 'classnames'
import React, { ReactElement, ReactNode, ReactNodeArray } from 'react'
import { StyledScrollableBar } from 'src/routes/safe/components/Transactions/TxList/styled'
import styled from 'styled-components'

const ModalStyled = styled(ModalMUI)`
  & {
    align-items: center;
    flex-direction: column;
    display: flex;
    overflow-y: scroll;
  }

  .paper {
    position: relative;
    top: 68px;
    width: 500px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 0 5px 0 rgba(74, 85, 121, 0.5);
    display: flex;
    flex-direction: column;

    &:focus {
      outline: none;
    }

    // TODO: replace class-based styles by params
    &.receive-modal {
      height: auto;
      max-width: calc(100% - 130px);
      min-height: 544px;
      overflow: hidden;
    }

    &.bigger-modal-window {
      width: 775px;
      height: auto;
    }

    &.smaller-modal-window {
      height: auto;
    }

    &.modal {
      height: auto;
      max-width: calc(100% - 130px);
      overflow: hidden;
    }
  }
`

interface GnoModalProps {
  children: ReactNode
  description: string
  // type copied from Material-UI Modal's `close` prop
  handleClose?: (event: Record<string, unknown>, reason: 'backdropClick' | 'escapeKeyDown') => void
  open: boolean
  paperClassName?: string
  title: string
}

const GnoModal = ({ children, description, handleClose, open, paperClassName, title }: GnoModalProps): ReactElement => {
  return (
    <ModalStyled aria-describedby={description} aria-labelledby={title} onClose={handleClose} open={open}>
      <div className={cn('paper', paperClassName)}>{children}</div>
    </ModalStyled>
  )
}

export default GnoModal

/*****************/
/* Generic Modal */
/*****************/

/*** Header ***/
const HeaderSection = styled.div`
  display: flex;
  padding: 16px 24px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};

  .title-icon {
    width: 20px;
    margin-right: 10px;
  }

  .title-note {
    margin-left: 12px;
  }

  .close-button {
    align-self: flex-end;
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
  }
`

const HeaderTitle = styled(Title)`
  flex-basis: 100%;
`

interface HeaderProps {
  title: string
  iconUrl?: string
  titleNote?: string
  onClose?: (event: any) => void
}

const Header = ({ title, titleNote, iconUrl, onClose }: HeaderProps): ReactElement => {
  return (
    <HeaderSection className="modal-header">
      {iconUrl && <img alt={title} className="title-icon" src={iconUrl} />}

      <HeaderTitle size="xs" withoutMargin>
        {title}
        {titleNote && (
          <Text size="lg" color="secondaryLight" as="span" className="title-note">
            {titleNote}
          </Text>
        )}
      </HeaderTitle>

      {onClose && (
        <button className="close-button" onClick={onClose}>
          <Icon size="sm" type="cross" />
        </button>
      )}
    </HeaderSection>
  )
}

/*** Body ***/
const BodySection = styled(StyledScrollableBar)<{ withoutPadding: BodyProps['withoutPadding'] }>`
  max-height: calc(90vh - 300px);
  overflow-y: scroll;
  padding: ${({ withoutPadding }) => (withoutPadding ? 0 : '24px')};
`

interface BodyProps {
  children: ReactNode | ReactNodeArray
  withoutPadding?: boolean
}

const Body = ({ children, withoutPadding = false }: BodyProps): ReactElement => (
  <BodySection className="modal-body" withoutPadding={withoutPadding}>
    {children}
  </BodySection>
)

/*** Footer ***/
const FooterSection = styled.div`
  flex: 1 1 auto;
  border-top: 2px solid ${({ theme }) => theme.colors.separator};
  padding: 16px 24px;
`

interface FooterProps {
  children: ReactNode | ReactNodeArray
}

const Footer = ({ children }: FooterProps): ReactElement => (
  <FooterSection className="modal-footer">{children}</FooterSection>
)

interface ModalProps {
  children: ReactNode
  description: string
  handleClose: () => void
  open: boolean
  title: string
}

export const Modal = ({ children, ...props }: ModalProps): ReactElement => {
  return (
    <GnoModal {...props} paperClassName="modal">
      {children}
    </GnoModal>
  )
}

Modal.Header = Header
Modal.Body = Body
Modal.Footer = Footer
