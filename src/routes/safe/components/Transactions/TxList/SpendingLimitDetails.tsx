import { useMemo } from 'react'
import styled from 'styled-components'

import useTokenInfo from 'src/logic/safe/hooks/useTokenInfo'
import { sameString } from 'src/utils/strings'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getResetTimeOptions } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields/ResetTime'
import { AddressInfo, ResetTimeInfo, TokenInfo } from 'src/routes/safe/components/Settings/SpendingLimit/InfoDisplay'
import { TransactionData, TransactionInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { getTxTo } from 'src/routes/safe/components/Transactions/TxList/utils'
import { StyledDetailsTitle, StyledTxInfoDetails } from 'src/routes/safe/components/Transactions/TxList/styled'

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
    <StyledTxInfoDetails>
      <StyledDetailsTitle size="xl" strong>
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
      {tokenInfo && (
        <StyledInfoBlock>
          <TokenInfo
            amount={fromTokenUnit(amount as string, tokenInfo.decimals)}
            title="Amount"
            token={tokenInfo}
            color="placeHolder"
          />
        </StyledInfoBlock>
      )}
      <StyledInfoBlock>
        <ResetTimeInfo title="Reset Time" label={resetTimeLabel} color="placeHolder" />
      </StyledInfoBlock>
    </StyledTxInfoDetails>
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
    <StyledTxInfoDetails>
      <StyledDetailsTitle size="xl" strong>
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
      {tokenInfo && (
        <StyledInfoBlock>
          <TokenInfo amount="" title="Token" token={tokenInfo} />
        </StyledInfoBlock>
      )}
    </StyledTxInfoDetails>
  )
}
