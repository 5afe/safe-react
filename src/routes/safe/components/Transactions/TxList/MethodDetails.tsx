import { Text } from '@gnosis.pm/safe-react-components'

import styled from 'styled-components'

import { isArrayParameter } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import Value from 'src/routes/safe/components/Transactions/TxList/MethodValue'
import { DataDecoded } from '@gnosis.pm/safe-react-gateway-sdk'

const TxDetailsMethodParam = styled.div<{ isArrayParameter: boolean }>`
  padding-left: 24px;
  display: ${({ isArrayParameter }) => (isArrayParameter ? 'block' : 'flex')};
  align-items: center;
  flex-wrap: wrap;

  p:first-of-type {
    margin-right: ${({ isArrayParameter }) => (isArrayParameter ? '0' : '4px')};
  }
`

const TxInfo = styled.div`
  padding: 8px 0;
  overflow-x: auto;
`

const ValueWrapper = styled.div`
  min-width: 50%;
  flex-shrink: 0;
`

export const MethodDetails = ({ data }: { data: DataDecoded }): React.ReactElement => {
  return (
    <TxInfo>
      <Text size="xl" strong>
        {data.method}
      </Text>

      {data.parameters?.map((param, index) => (
        <TxDetailsMethodParam key={`${data.method}_param-${index}`} isArrayParameter={isArrayParameter(param.type)}>
          <Text size="xl" strong>
            {param.name}({param.type}):
          </Text>
          <ValueWrapper>
            <Value method={data.method} type={param.type} value={param.value as string} />
          </ValueWrapper>
        </TxDetailsMethodParam>
      ))}
    </TxInfo>
  )
}
