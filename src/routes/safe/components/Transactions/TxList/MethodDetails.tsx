import styled from 'styled-components'
import { DataDecoded } from '@gnosis.pm/safe-react-gateway-sdk'

import { StyledDetailsTitle } from 'src/routes/safe/components/Transactions/TxList/styled'
import { TxDataRow } from 'src/routes/safe/components/Transactions/TxList/TxDataRow'
import { camelCaseToSpaces } from 'src/utils/camelCaseToSpaces'
import {
  isAddress,
  isArrayParameter,
  isByte,
} from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'

const TxInfo = styled.div`
  padding: 8px 0;
  overflow-x: auto;
`

export const MethodDetails = ({ data }: { data: DataDecoded }): React.ReactElement => {
  const methodName = camelCaseToSpaces(data.method)
  return (
    <TxInfo>
      <StyledDetailsTitle size="sm" strong color="placeHolder" uppercase>
        {methodName}
      </StyledDetailsTitle>

      {data.parameters?.map((param, index) => {
        const isArrayValueParam = isArrayParameter(param.type) || Array.isArray(param.value)
        const inlineType = isAddress(param.type) ? 'address' : isByte(param.type) ? 'bytes' : undefined
        return (
          <TxDataRow
            key={`${data.method}_param-${index}`}
            title={`${param.name}(${param.type}):`}
            value={param.value as string}
            isArray={isArrayValueParam}
            method={data.method}
            paramType={param.type}
            inlineType={inlineType}
          />
        )
      })}
    </TxInfo>
  )
}
