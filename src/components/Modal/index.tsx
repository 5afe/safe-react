import { Button, Icon, Loader, theme, Title as TitleSRC } from '@gnosis.pm/safe-react-components'
import { ButtonProps as ButtonPropsMUI, Modal as ModalMUI } from '@material-ui/core'
import cn from 'classnames'
import React, { ReactElement, ReactNode, ReactNodeArray } from 'react'
import styled from 'styled-components'

type Theme = typeof theme

const ModalStyled = styled(ModalMUI)`
  & {
    align-items: center;
    flex-direction: column;
    display: flex;
    overflow-y: scroll;
  }

  .overlay {
    background-color: rgba(232, 231, 230, 0.75) !important;
  }

  .paper {
    position: relative;
    top: 68px;
    width: 500px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 1px 2px 10px 0 rgba(40, 54, 61, 0.18);
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
    <ModalStyled
      BackdropProps={{ className: 'overlay' }}
      aria-describedby={description}
      aria-labelledby={title}
      onClose={handleClose}
      open={open}
    >
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
  padding: 24px 18px 24px 24px;
  border-bottom: 2px solid ${({ theme }) => theme.colors.separator};

  h5 {
    color: ${({ theme }) => theme.colors.text};
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

const TitleStyled = styled(TitleSRC)`
  display: flex;
  align-items: center;
  flex-basis: 100%;

  .image,
  img {
    width: 20px;
    margin-right: 10px;
  }

  .note,
  span {
    margin-left: 12px;
  }
`

interface TitleProps {
  children: string | ReactNode
  size?: keyof Theme['title']['size']
  withoutMargin?: boolean
  strong?: boolean
}

const Title = ({ children, ...props }: TitleProps): ReactElement => (
  <TitleStyled size="xs" withoutMargin {...props}>
    {children}
  </TitleStyled>
)

interface HeaderProps {
  children?: ReactNode
  onClose?: (event: any) => void
}

const Header = ({ children, onClose }: HeaderProps): ReactElement => {
  return (
    <HeaderSection className="modal-header">
      {children}

      {onClose && (
        <button className="close-button" onClick={onClose}>
          <Icon size="sm" type="cross" />
        </button>
      )}
    </HeaderSection>
  )
}

Header.Title = Title

/*** Body ***/
const BodySection = styled.div<{ withoutPadding: BodyProps['withoutPadding'] }>`
  padding: ${({ withoutPadding }) => (withoutPadding ? 0 : '24px')};
  min-height: 200px;
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
const FooterSection = styled.div<{ withoutBorder: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: ${({ withoutBorder }) => (withoutBorder ? '0' : '2px')} solid ${({ theme }) => theme.colors.separator};
  height: 84px;
  gap: 16px;
`

const LoaderText = styled.span`
  margin-left: 10px;
`

export enum ButtonStatus {
  ERROR = -1,
  DISABLED,
  READY,
  LOADING,
}

type CustomButtonMUIProps = Omit<ButtonPropsMUI, 'size' | 'color' | 'variant'> & {
  to?: string
  component?: ReactNode
}

export interface ButtonProps extends CustomButtonMUIProps {
  text?: string
  status?: ButtonStatus
  size?: keyof Theme['buttons']['size']
  color?: 'primary' | 'secondary' | 'error'
  variant?: 'bordered' | 'contained' | 'outlined'
  testId?: string
}

interface ButtonsProps {
  cancelButtonProps?: ButtonProps
  confirmButtonProps?: ButtonProps
}

const Buttons = ({ cancelButtonProps = {}, confirmButtonProps = {} }: ButtonsProps): ReactElement => {
  const {
    disabled: cancelDisabled,
    status: cancelStatus = ButtonStatus.READY,
    text: cancelText = ButtonStatus.LOADING === cancelStatus ? 'Cancelling' : 'Cancel',
    testId: cancelTestId = '',
    ...cancelProps
  } = cancelButtonProps
  const {
    disabled: confirmDisabled,
    status: confirmStatus = ButtonStatus.READY,
    text: confirmText = ButtonStatus.LOADING === confirmStatus ? 'Submitting' : 'Submit',
    testId: confirmTestId = '',
    ...confirmProps
  } = confirmButtonProps

  return (
    <>
      <Button
        size="md"
        color="primary"
        variant="outlined"
        type={cancelProps?.onClick ? 'button' : 'submit'}
        disabled={cancelDisabled || [ButtonStatus.DISABLED, ButtonStatus.LOADING].includes(cancelStatus)}
        data-testid={cancelTestId}
        {...cancelProps}
      >
        {ButtonStatus.LOADING === cancelStatus ? (
          <>
            <Loader size="xs" color="secondaryLight" />
            <LoaderText>{cancelText}</LoaderText>
          </>
        ) : (
          cancelText
        )}
      </Button>
      <Button
        size="md"
        type={confirmProps?.onClick ? 'button' : 'submit'}
        disabled={confirmDisabled || [ButtonStatus.DISABLED, ButtonStatus.LOADING].includes(confirmStatus)}
        data-testid={confirmTestId}
        {...confirmProps}
      >
        {ButtonStatus.LOADING === confirmStatus ? (
          <>
            <Loader size="xs" color="secondaryLight" />
            <LoaderText>{confirmText}</LoaderText>
          </>
        ) : (
          confirmText
        )}
      </Button>
    </>
  )
}

interface FooterProps {
  children: ReactNode | ReactNodeArray
  withoutBorder?: boolean
}

const Footer = ({ children, withoutBorder = false }: FooterProps): ReactElement => (
  <FooterSection className="modal-footer" withoutBorder={withoutBorder}>
    {children}
  </FooterSection>
)

Footer.Buttons = Buttons

interface ModalProps {
  children: ReactNode
  description?: string
  handleClose: () => void
  open?: boolean
  title?: string
}

export const Modal = ({ children, description = '', open = true, title = '', ...props }: ModalProps): ReactElement => {
  return (
    <GnoModal {...props} description={description} open={open} title={title} paperClassName="modal">
      {children}
    </GnoModal>
  )
}

Modal.Header = Header
Modal.Body = Body
Modal.Footer = Footer
