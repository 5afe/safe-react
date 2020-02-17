// @flow
import React from 'react'
import styled from 'styled-components'

import Paragraph from '~/components/layout/Paragraph'
import Button from '~/components/layout/Button'
import { lg } from '~/theme/variables'

const StyledParagraph = styled(Paragraph)`
  && {
    font-size: ${lg};
  }
`
export const ModalTitle = ({ title }: { title: string }) => {
  return (
    <StyledParagraph weight="bolder" noMargin>
      {title}
    </StyledParagraph>
  )
}

const FooterWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`

export const ModalFooterConfirmation = ({
  okText,
  cancelText,
  handleOk,
  handleCancel,
}: {
  okText: string,
  cancelText: string,
  handleOk: () => void,
  handleCancel: () => void,
}) => {
  return (
    <FooterWrapper>
      <Button minWidth={130} onClick={handleCancel}>
        {cancelText}
      </Button>
      <Button
        color="primary"
        minWidth={130}
        onClick={handleOk}
        variant="contained"
      >
        {okText}
      </Button>
    </FooterWrapper>
  )
}
