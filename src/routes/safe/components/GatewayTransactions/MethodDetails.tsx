import { Text } from '@gnosis.pm/safe-react-components'
import React from 'react'
import styled from 'styled-components'

import { DataDecoded } from 'src/logic/safe/store/models/types/gateway.d'
import { isArrayParameter } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import {
  DeleteSpendingLimitDetails,
  isDeleteAllowance,
  isSetAllowance,
  ModifySpendingLimitDetails,
} from 'src/routes/safe/components/GatewayTransactions/SpendingLimitDetails'
import Value from 'src/routes/safe/components/Transactions/TxsTable/ExpandedTx/TxDescription/Value'

const TxDetailsMethodName = styled(Text)`
  text-indent: 4px;
`

const TxDetailsMethodParam = styled.div<{ isArrayParameter: boolean }>`
  padding-left: 8px;
  display: ${({ isArrayParameter }) => (isArrayParameter ? 'block' : 'flex')};
  align-items: center;

  p:first-of-type {
    margin-right: ${({ isArrayParameter }) => (isArrayParameter ? '0' : '4px')};
  }
`

const TxInfo = styled.div`
  padding: 8px 8px 8px 16px;
`

const StyledMethodName = styled(Text)`
  white-space: nowrap;
`

export const MethodDetails = ({ data }: { data: DataDecoded }): React.ReactElement => {
  // FixMe: this way won't scale well
  if (isSetAllowance(data.method)) {
    return <ModifySpendingLimitDetails data={data} />
  }

  // FixMe: this way won't scale well
  if (isDeleteAllowance(data.method)) {
    return <DeleteSpendingLimitDetails data={data} />
  }

  return (
    <TxInfo>
      <TxDetailsMethodName size="lg" strong>
        {data.method}
      </TxDetailsMethodName>

      {data.parameters?.map((param, index) => (
        <TxDetailsMethodParam key={`${data.method}_param-${index}`} isArrayParameter={isArrayParameter(param.type)}>
          <StyledMethodName size="lg" strong>
            {param.name}({param.type}):
          </StyledMethodName>
          <Value method={data.method} type={param.type} value={param.value} />
        </TxDetailsMethodParam>
      ))}
    </TxInfo>
  )
}
