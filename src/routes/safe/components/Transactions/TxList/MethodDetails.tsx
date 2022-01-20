import styled from 'styled-components'

import { DataDecoded } from '@gnosis.pm/safe-react-gateway-sdk'
import { StyledDetailsTitle } from 'src/routes/safe/components/Transactions/TxList/styled'
import { TxDataRow } from 'src/routes/safe/components/Transactions/TxList/TxDataRow'
import { camelCaseToSpaces } from 'src/routes/safe/components/Transactions/TxList/utils'

const TxInfo = styled.div`
  padding: 8px 0;
`

export const MethodDetails = ({ data }: { data: DataDecoded }): React.ReactElement => {
  const methodName = camelCaseToSpaces(data.method)
  return (
    <TxInfo>
      <StyledDetailsTitle size="sm" strong color="placeHolder">
        {methodName}
      </StyledDetailsTitle>

      {data.parameters?.map((param, index) => {
        return (
          <TxDataRow
            key={`${data.method}_param-${index}`}
            title={`${param.name}(${param.type}):`}
            value={param.value as string}
            inlineType={param.type === 'address' ? 'hash' : undefined}
          />
        )
      })}
    </TxInfo>
  )
}
