import { Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, useMemo } from 'react'
import styled from 'styled-components'

import { Token } from 'src/logic/tokens/store/model/token'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import useTokenInfo from 'src/logic/safe/hooks/useTokenInfo'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
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

type FormattedAmountsProps = { amount: string; spent: string; tokenInfo?: Token }

type FormattedAmounts = { amount: string; spent: string }

const useFormattedAmounts = ({ amount, spent, tokenInfo }: FormattedAmountsProps): FormattedAmounts | undefined => {
  return useMemo(() => {
    if (tokenInfo) {
      const formattedSpent = formatAmount(fromTokenUnit(spent, tokenInfo.decimals)).toString()
      const formattedAmount = formatAmount(fromTokenUnit(amount, tokenInfo.decimals)).toString()
      return { amount: formattedAmount, spent: formattedSpent }
    }
  }, [amount, spent, tokenInfo])
}

interface SpentVsAmountProps {
  amount: string
  spent: string
  tokenAddress: string
}

const SpentVsAmount = ({ amount, spent, tokenAddress }: SpentVsAmountProps): ReactElement | null => {
  const { width } = useWindowDimensions()
  const showIcon = useMemo(() => width > 1024, [width])

  const tokenInfo = useTokenInfo(tokenAddress)
  const spentInfo = useFormattedAmounts({ amount, spent, tokenInfo })

  return spentInfo && tokenInfo ? (
    <StyledImageName>
      {showIcon && <StyledImage alt={tokenInfo.name} onError={setImageToPlaceholder} src={tokenInfo.logoUri} />}
      <Text size="lg">{`${spentInfo.spent} of ${spentInfo.amount} ${tokenInfo.symbol}`}</Text>
    </StyledImageName>
  ) : null
}

export default SpentVsAmount
