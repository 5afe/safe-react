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

const SpendingLimitRow = styled.div`
  margin-bottom: 16px;
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
    <>
      <SpendingLimitRow>
        <Text size="xl" strong>
          Modify spending limit:
        </Text>
      </SpendingLimitRow>
      <SpendingLimitRow>
        <AddressInfo
          title="Beneficiary"
          address={(beneficiary as string) || txTo?.value || '0x'}
          name={txTo?.name || undefined}
          logoUri={txTo?.logoUri || undefined}
        />
      </SpendingLimitRow>
      <SpendingLimitRow>
        {tokenInfo && (
          <TokenInfo amount={fromTokenUnit(amount as string, tokenInfo.decimals)} title="Amount" token={tokenInfo} />
        )}
      </SpendingLimitRow>
      <SpendingLimitRow>
        <ResetTimeInfo title="Reset Time" label={resetTimeLabel} />
      </SpendingLimitRow>
    </>
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
    <>
      <SpendingLimitRow>
        <Text size="xl" strong>
          Delete spending limit:
        </Text>
      </SpendingLimitRow>
      <SpendingLimitRow>
        <AddressInfo
          title="Beneficiary"
          address={(beneficiary as string) || txTo?.value || '0x'}
          name={txTo?.name || undefined}
          logoUri={txTo?.logoUri || undefined}
        />
      </SpendingLimitRow>
      <SpendingLimitRow>{tokenInfo && <TokenInfo amount="" title="Token" token={tokenInfo} />}</SpendingLimitRow>
    </>
  )
}
