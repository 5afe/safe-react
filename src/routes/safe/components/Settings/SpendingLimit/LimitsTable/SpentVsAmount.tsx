import { Text } from '@gnosis.pm/safe-react-components'
import React from 'react'
import styled from 'styled-components'

import { Token } from 'src/logic/tokens/store/model/token'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import useToken from 'src/routes/safe/components/Settings/SpendingLimit/hooks/useToken'
import { fromTokenUnit } from 'src/routes/safe/components/Settings/SpendingLimit/utils'
import { useWindowDimensions } from 'src/logic/hooks/useWindowDimensions'

const StyledImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin: 0 8px 0 0;
`

const StyledImageName = styled.div`
  display: flex;
  align-items: center;
`

type FormattedAmountsProps = { amount: string; spent: string; token?: Token }

type FormattedAmounts = { amount: string; spent: string }

const useFormattedAmounts = ({ amount, spent, token }: FormattedAmountsProps): FormattedAmounts => {
  return React.useMemo(() => {
    if (token) {
      const formattedSpent = formatAmount(fromTokenUnit(spent, token.decimals)).toString()
      const formattedAmount = formatAmount(fromTokenUnit(amount, token.decimals)).toString()
      return { amount: formattedAmount, spent: formattedSpent }
    }

    return null
  }, [amount, spent, token])
}

interface SpentVsAmountProps {
  amount: string
  spent: string
  tokenAddress: string
}

const SpentVsAmount = ({ amount, spent, tokenAddress }: SpentVsAmountProps): React.ReactElement => {
  const { width } = useWindowDimensions()
  const showIcon = React.useMemo(() => width > 1024, [width])

  const token = useToken(tokenAddress)
  const spentInfo = useFormattedAmounts({ amount, spent, token })

  return spentInfo ? (
    <StyledImageName>
      {showIcon && <StyledImage alt={token.name} onError={setImageToPlaceholder} src={token.logoUri} />}
      <Text size="lg">{`${spentInfo.spent} of ${spentInfo.amount} ${token.symbol}`}</Text>
    </StyledImageName>
  ) : null
}

export default SpentVsAmount
