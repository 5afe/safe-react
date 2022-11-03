import styled from 'styled-components'
import { Button, Loader, theme, Title as TitleSRC } from '@gnosis.pm/safe-react-components'
import { ButtonProps as ButtonPropsMUI, Modal as ModalMUI } from '@material-ui/core'
import cn from 'classnames'
import { ReactElement, ReactNode } from 'react'
import { ModalHeader } from 'src/routes/safe/components/Balances/SendModal/screens/ModalHeader'
import { getModalEvent } from 'src/utils/events/modals'
import { trackEvent } from 'src/utils/googleTagManager'
import { screenSm } from 'src/theme/variables'

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
    width: 525px;
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

    @media (max-width: ${screenSm}px) {
      width: 100vw;
      max-width: 100vw !important;
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
  style?: React.CSSProperties
}

const GnoModal = ({
  children,
  description,
  handleClose,
  open,
  paperClassName,
  title,
  style,
}: GnoModalProps): ReactElement => {
  return (
    <ModalStyled
      BackdropProps={{ className: 'overlay' }}
      aria-describedby={description}
      aria-labelledby={title}
      onClose={handleClose}
      open={open}
      style={style}
    >
      <div className={cn('paper', paperClassName)}>{children}</div>
    </ModalStyled>
  )
}

export default GnoModal

/*****************/
/* Generic Modal */
/*****************/

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
  onClose?: () => unknown
}

const Header = ({ children = '', onClose = () => null }: HeaderProps): ReactElement => {
  return <ModalHeader title={children} onClose={onClose} />
}

Header.Title = Title

/*** Body ***/
const BodySection = styled.div<{ withoutPadding: BodyProps['withoutPadding'] }>`
  padding: ${({ withoutPadding }) => (withoutPadding ? 0 : '24px')};
  min-height: 200px;
`

interface BodyProps {
  children: ReactNode
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
    onClick: cancelOnClick,
    ...cancelProps
  } = cancelButtonProps
  const {
    disabled: confirmDisabled,
    status: confirmStatus = ButtonStatus.READY,
    text: confirmText = ButtonStatus.LOADING === confirmStatus ? 'Submitting' : 'Submit',
    testId: confirmTestId = '',
    onClick: confirmOnClick,
    ...confirmProps
  } = confirmButtonProps

  return (
    <>
      <Button
        size="md"
        color="primary"
        variant={cancelButtonProps.variant || 'outlined'}
        type={cancelOnClick ? 'button' : 'submit'}
        disabled={cancelDisabled || [ButtonStatus.DISABLED, ButtonStatus.LOADING].includes(cancelStatus)}
        data-testid={cancelTestId}
        onClick={(e) => {
          trackEvent(getModalEvent(cancelText))
          cancelOnClick?.(e)
        }}
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
        type={confirmOnClick ? 'button' : 'submit'}
        disabled={confirmDisabled || [ButtonStatus.DISABLED, ButtonStatus.LOADING].includes(confirmStatus)}
        data-testid={confirmTestId}
        onClick={(e) => {
          trackEvent(getModalEvent(confirmText))
          confirmOnClick?.(e)
        }}
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
  children: ReactNode
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
  style?: React.CSSProperties
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
