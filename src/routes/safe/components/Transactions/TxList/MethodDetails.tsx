import styled from 'styled-components'

import { DataDecoded } from '@gnosis.pm/safe-react-gateway-sdk'
import { StyledDetailsTitle } from 'src/routes/safe/components/Transactions/TxList/styled'
import { TxDataRow } from 'src/routes/safe/components/Transactions/TxList/TxDataRow'

const TxInfo = styled.div`
  padding: 8px 0;
`

const camelCaseToSpaces = (string) => {
  return string.replace(/([A-Z])/g, ' $1')
}

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
