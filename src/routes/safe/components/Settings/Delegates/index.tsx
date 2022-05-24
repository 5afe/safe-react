import { ReactElement } from 'react'

import Block from 'src/components/layout/Block'
import Heading from 'src/components/layout/Heading'
import Paragraph from 'src/components/layout/Paragraph/index'
import styled from 'styled-components'
import { lg } from 'src/theme/variables'

const StyledBlock = styled(Block)`
  minheight: 420px;
`

const StyledHeading = styled(Heading)`
  padding: ${lg};
  padding-bottom: 0;
`

const StyledParagraph = styled(Paragraph)`
  padding-left: ${lg};
`

const Delegates = (): ReactElement => {
  return (
    <StyledBlock>
      <StyledHeading tag="h2">Manage Safe Delegates</StyledHeading>
      <StyledParagraph>Get, add and delete delegates.</StyledParagraph>
    </StyledBlock>
  )
}

export default Delegates
