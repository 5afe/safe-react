import React from 'react'
import styled from 'styled-components'

import Paragraph from 'src/components/layout/Paragraph'
import { lg } from 'src/theme/variables'

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

const ModalTitle = ({ iconUrl, title }: { title: string; iconUrl: string }) => {
  return (
    <TitleWrapper>
      {iconUrl && <IconImg alt={title} src={iconUrl} />}
      <StyledParagraph noMargin weight="bolder">
        {title}
      </StyledParagraph>
    </TitleWrapper>
  )
}

export default ModalTitle
