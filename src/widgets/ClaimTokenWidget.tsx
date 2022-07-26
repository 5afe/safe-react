import { ReactElement } from 'react'
import styled from 'styled-components'
import { Button } from '@gnosis.pm/safe-react-components'

import { black500, extraLargeFontSize, largeFontSize } from 'src/theme/variables'
import { SafeWidgetComponentProps } from 'src/components/Dashboard/SafeWidget/SafeWidget'

const ClaimTokenWidget = ({ data, widget }: SafeWidgetComponentProps): ReactElement => {
  const { iconUrl, tokenSymbol } = widget.widgetProps as any
  const { totalAmount } = data || {}
  return (
    <WidgetCard>
      <div>
        <TokenLogo src={iconUrl} />
      </div>
      <AmountLabel>
        {totalAmount} {tokenSymbol}
      </AmountLabel>
      <div>
        <Button
          size={'md'}
          onClick={() => {
            console.log('Click!')
          }}
        >
          Claim
        </Button>
      </div>
    </WidgetCard>
  )
}

export default ClaimTokenWidget

const WidgetCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;

  text-align: center;
  color: ${black500};
  font-size: ${largeFontSize};
`

export const AmountLabel = styled.p`
  color: ${black500};
  font-size: ${extraLargeFontSize};
  margin-top: 0;
  margin-bottom: 8px;
`

export const TokenLogo = styled.img`
  height: 60px;
  margin-bottom: 8px;
`
