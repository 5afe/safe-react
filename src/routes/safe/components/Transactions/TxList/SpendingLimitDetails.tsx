import { Text } from '@gnosis.pm/safe-react-components'
import { useMemo } from 'react'
import styled from 'styled-components'

import useTokenInfo from 'src/logic/safe/hooks/useTokenInfo'
import { sameString } from 'src/utils/strings'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getResetTimeOptions } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields/ResetTime'
import { AddressInfo, ResetTimeInfo, TokenInfo } from 'src/routes/safe/components/Settings/SpendingLimit/InfoDisplay'
import { TransactionData, TransactionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { getTxTo } from './utils'
import { md } from 'src/theme/variables'

const SET_ALLOWANCE = 'setAllowance'
const DELETE_ALLOWANCE = 'deleteAllowance'

export const isSetAllowance = (method?: string): boolean => {
  return sameString(method, SET_ALLOWANCE)
}

export const isDeleteAllowance = (method?: string): boolean => {
  return sameString(method, DELETE_ALLOWANCE)
}

export const isSpendingLimitMethod = (method?: string): boolean => {
  return isSetAllowance(method) || isDeleteAllowance(method)
}

const StyledSpendingLimitDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${md};

  & > * > *:nth(2)-child {
    margin-top: 4px;
  }
`

const StyledDetailsTitle = styled(Text)`
  text-transform: uppercase;
  letter-spacing: 1px;
`

const StyledInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

type SpendingLimitProps = {
  txData: TransactionData
  txInfo: TransactionInfo
}

export const ModifySpendingLimitDetails = ({ txData, txInfo }: SpendingLimitProps): React.ReactElement => {
  const { dataDecoded } = txData
  const [beneficiary, tokenAddress, amount, resetTimeMin] = useMemo(
    () => dataDecoded?.parameters?.map(({ value }) => value) ?? [],
    [dataDecoded?.parameters],
  )

  const resetTimeLabel = useMemo(
    () => getResetTimeOptions().find(({ value }) => +value === +resetTimeMin)?.label ?? '',
    [resetTimeMin],
  )

  const tokenInfo = useTokenInfo(tokenAddress as string)
  const txTo = getTxTo({ txInfo })

  return (
    <StyledSpendingLimitDetails>
      <StyledDetailsTitle size="sm" strong color="placeHolder">
        Modify spending limit:
      </StyledDetailsTitle>
      <StyledInfoBlock>
        <AddressInfo
          title="Beneficiary"
          address={(beneficiary as string) || txTo?.value || '0x'}
          name={txTo?.name || undefined}
          logoUri={txTo?.logoUri || undefined}
          color="placeHolder"
        />
      </StyledInfoBlock>
      <StyledInfoBlock>
        {tokenInfo && (
          <TokenInfo
            amount={fromTokenUnit(amount as string, tokenInfo.decimals)}
            title="Amount"
            token={tokenInfo}
            color="placeHolder"
          />
        )}
      </StyledInfoBlock>
      <StyledInfoBlock>
        <ResetTimeInfo title="Reset Time" label={resetTimeLabel} color="placeHolder" />
      </StyledInfoBlock>
    </StyledSpendingLimitDetails>
  )
}

export const DeleteSpendingLimitDetails = ({ txData, txInfo }: SpendingLimitProps): React.ReactElement => {
  const { dataDecoded } = txData
  const [beneficiary, tokenAddress] = useMemo(
    () => dataDecoded?.parameters?.map(({ value }) => value) ?? [],
    [dataDecoded?.parameters],
  )
  const tokenInfo = useTokenInfo(tokenAddress as string)
  const txTo = getTxTo({ txInfo })

  return (
    <StyledSpendingLimitDetails>
      <StyledDetailsTitle size="sm" strong color="placeHolder">
        Delete spending limit:
      </StyledDetailsTitle>
      <StyledInfoBlock>
        <AddressInfo
          title="Beneficiary"
          address={(beneficiary as string) || txTo?.value || '0x'}
          name={txTo?.name || undefined}
          logoUri={txTo?.logoUri || undefined}
        />
      </StyledInfoBlock>
      <StyledInfoBlock>{tokenInfo && <TokenInfo amount="" title="Token" token={tokenInfo} />}</StyledInfoBlock>
    </StyledSpendingLimitDetails>
  )
}
