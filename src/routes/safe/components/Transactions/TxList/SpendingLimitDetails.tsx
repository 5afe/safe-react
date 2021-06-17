import { Text } from '@gnosis.pm/safe-react-components'
import React from 'react'
import { sameString } from 'src/utils/strings'
import styled from 'styled-components'

import useTokenInfo from 'src/logic/safe/hooks/useTokenInfo'
import { DataDecoded } from 'src/logic/safe/store/models/types/gateway.d'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getResetTimeOptions } from 'src/routes/safe/components/Settings/SpendingLimit/FormFields/ResetTime'
import { AddressInfo, ResetTimeInfo, TokenInfo } from 'src/routes/safe/components/Settings/SpendingLimit/InfoDisplay'

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

export const ModifySpendingLimitDetails = ({ data }: { data: DataDecoded }): React.ReactElement => {
  const [beneficiary, tokenAddress, amount, resetTimeMin] = React.useMemo(
    () => data.parameters?.map(({ value }) => value) ?? [],
    [data.parameters],
  )

  const resetTimeLabel = React.useMemo(
    () => getResetTimeOptions().find(({ value }) => +value === +resetTimeMin)?.label ?? '',
    [resetTimeMin],
  )

  const tokenInfo = useTokenInfo(tokenAddress)

  return (
    <>
      <SpendingLimitRow>
        <Text size="xl" strong>
          Modify spending limit:
        </Text>
      </SpendingLimitRow>
      <SpendingLimitRow>
        <AddressInfo title="Beneficiary" address={beneficiary} />
      </SpendingLimitRow>
      <SpendingLimitRow>
        {tokenInfo && <TokenInfo amount={fromTokenUnit(amount, tokenInfo.decimals)} title="Amount" token={tokenInfo} />}
      </SpendingLimitRow>
      <SpendingLimitRow>
        <ResetTimeInfo title="Reset Time" label={resetTimeLabel} />
      </SpendingLimitRow>
    </>
  )
}

export const DeleteSpendingLimitDetails = ({ data }: { data: DataDecoded }): React.ReactElement => {
  const [beneficiary, tokenAddress] = React.useMemo(() => data.parameters?.map(({ value }) => value) ?? [], [
    data.parameters,
  ])
  const tokenInfo = useTokenInfo(tokenAddress)

  return (
    <>
      <SpendingLimitRow>
        <Text size="xl" strong>
          Delete spending limit:
        </Text>
      </SpendingLimitRow>
      <SpendingLimitRow>
        <AddressInfo title="Beneficiary" address={beneficiary} />
      </SpendingLimitRow>
      <SpendingLimitRow>{tokenInfo && <TokenInfo amount="" title="Token" token={tokenInfo} />}</SpendingLimitRow>
    </>
  )
}
