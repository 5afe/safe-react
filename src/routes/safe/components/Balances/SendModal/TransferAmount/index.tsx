import { ReactElement } from 'react'
import styled from 'styled-components'

import { Token } from 'src/logic/tokens/store/model/token'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import Paragraph from 'src/components/layout/Paragraph'
import Block from 'src/components/layout/Block'

const AmountWrapper = styled.div`
  width: 100%;
  text-align: center;
`

const StyledBlock = styled(Block)`
  width: 40px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  & img {
    width: 26px;
    height: auto;
  }
`

export type TransferAmountProps = {
  token: Token
  text: string
}

export const TransferAmount = ({ token, text }: TransferAmountProps): ReactElement => {
  return (
    <AmountWrapper>
      <StyledBlock>
        <img alt={token.name} onError={setImageToPlaceholder} src={token.logoUri || ''} />
      </StyledBlock>
      <Paragraph size="xl" color="black600" noMargin style={{ marginTop: '8px' }}>
        {text}
      </Paragraph>
    </AmountWrapper>
  )
}
