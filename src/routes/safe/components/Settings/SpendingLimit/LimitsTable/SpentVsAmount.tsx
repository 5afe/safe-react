import { Text } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { Token } from 'src/logic/tokens/store/model/token'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { ETH_ADDRESS } from 'src/logic/tokens/utils/tokenHelpers'
import { ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'
import { fromTokenUnit } from 'src/routes/safe/components/Settings/SpendingLimit/utils'
import { useWindowDimensions } from 'src/routes/safe/container/hooks/useWindowDimensions'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'

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

const useSelectedToken = (address: string): Token => {
  const tokens = useSelector(extendedSafeTokensSelector)
  const [token, setToken] = React.useState<Token>(null)

  React.useEffect(() => {
    if (tokens) {
      const tokenAddress = address === ZERO_ADDRESS ? ETH_ADDRESS : address
      setToken(tokens.find((token) => token.address === tokenAddress) ?? null)
    }
  }, [address, tokens])

  return token
}

type FormattedAmountsProps = { amount: string; spent: string; token?: Token }

type FormattedAmounts = { amount: string; spent: string }

const useFormattedAmounts = ({ amount, spent, token }: FormattedAmountsProps): FormattedAmounts => {
  const [formattedAmounts, setFormattedAmounts] = React.useState<FormattedAmounts>(null)

  React.useEffect(() => {
    if (token) {
      const formattedSpent = formatAmount(fromTokenUnit(spent, token.decimals)).toString()
      const formattedAmount = formatAmount(fromTokenUnit(amount, token.decimals)).toString()
      setFormattedAmounts({ amount: formattedAmount, spent: formattedSpent })
    }
  }, [amount, spent, token])

  return formattedAmounts
}

interface SpentVsAmountProps {
  amount: string
  spent: string
  tokenAddress: string
}

const SpentVsAmount = ({ amount, spent, tokenAddress }: SpentVsAmountProps): React.ReactElement => {
  const { width } = useWindowDimensions()
  const token = useSelectedToken(tokenAddress)
  const spentInfo = useFormattedAmounts({ amount, spent, token })

  return spentInfo ? (
    <StyledImageName>
      {width > 1024 && <StyledImage alt={token.name} onError={setImageToPlaceholder} src={token.logoUri} />}
      <Text size="lg">{`${spentInfo.spent} of ${spentInfo.amount} ${token.symbol}`}</Text>
    </StyledImageName>
  ) : null
}

export default SpentVsAmount
