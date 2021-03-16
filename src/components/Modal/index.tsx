import Modal from '@material-ui/core/Modal'
import cn from 'classnames'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

const ModalStyled = styled(Modal)`
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
  }
`

interface GnoModalProps {
  children: ReactNode
  description: string
  // type copied from Material-UI Modal's `close` prop
  handleClose?: (event: Record<string, unknown>, reason: 'backdropClick' | 'escapeKeyDown') => void
  modalClassName?: string
  open: boolean
  paperClassName?: string
  title: string
}

const GnoModal = ({
  children,
  description,
  handleClose,
  modalClassName,
  open,
  paperClassName,
  title,
}: GnoModalProps): ReactElement => {
  return (
    <ModalStyled
      aria-describedby={description}
      aria-labelledby={title}
      className={modalClassName}
      onClose={handleClose}
      open={open}
    >
      <div className={cn('paper', paperClassName)}>{children}</div>
    </ModalStyled>
  )
}

export default GnoModal
