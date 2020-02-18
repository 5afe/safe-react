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
const IconImg = styled.img`
  width: 20px;
  margin-right: 10px;
`
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const ModalTitle = ({ title, iconUrl }: { title: string, iconUrl: string }) => {
  return (
    <TitleWrapper>
      {iconUrl && <IconImg src={iconUrl} alt={title} />}
      <StyledParagraph weight="bolder" noMargin>
        {title}
      </StyledParagraph>
    </TitleWrapper>
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
      <Button color="primary" minWidth={130} onClick={handleOk} variant="contained">
        {okText}
      </Button>
    </FooterWrapper>
  )
}
