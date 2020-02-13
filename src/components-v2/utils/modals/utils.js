// @flow
import React from 'react'
import styled from 'styled-components'

import Paragraph from '~/components/layout/Paragraph'
import { lg } from '~/theme/variables'

const StyledParagraph = styled(Paragraph)`
  && {
    font-size: ${lg};
  }
`
type ModalTitleProps = {
  title: string,
}

export const ModalTitle = ({ title }: ModalTitleProps) => {
  return (
    <StyledParagraph weight="bolder" noMargin>
      {title}
    </StyledParagraph>
  )
}

type ModalFooterConfirmationProps = {
  okText: string,
  cancelText: string,
  handleOk: () => void,
  handleCancel: () => void,
}

export const ModalFooterConfirmation = ({
  okText,
  cancelText,
  handleOk,
  handleCancel,
}: ModalFooterConfirmationProps) => {
  return (
    <div>
      <button type="button" onClick={handleCancel}>
        {cancelText}
      </button>
      <button type="button" onClick={handleOk}>
        {okText}
      </button>
    </div>
  )
}
