import { ReactElement } from 'react'
import styled from 'styled-components'
import { DecodedDataParameterValue, DecodedDataResponse } from '@gnosis.pm/safe-react-gateway-sdk'

import { getNativeCurrency } from 'src/config'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { BasicTxInfo, getParameterElement } from 'src/components/DecodeTxs'
import { DecodedTxDetailType } from 'src/routes/safe/components/Apps/components/ConfirmTxModal/index'

const Container = styled.div`
  word-break: break-word;

  & > div:last-child {
    margin: 0;
  }
`

export function isDataDecodedParameterValue(arg: DecodedTxDetailType): arg is DecodedDataParameterValue {
  return arg ? arg.hasOwnProperty('operation') : false
}

type Props = {
  decodedTxData: DecodedDataParameterValue | DecodedDataResponse
}

export const DecodedTxDetail = ({ decodedTxData: tx }: Props): ReactElement => {
  const nativeCurrency = getNativeCurrency()
  let body
  // If we are dealing with a multiSend
  // decodedTxData is of type DataDecodedParameter
  if (isDataDecodedParameterValue(tx)) {
    const txValue = fromTokenUnit(tx.value, nativeCurrency.decimals)

    body = (
      <>
        <BasicTxInfo txRecipient={tx.to} txData={tx.data} txValue={txValue} />
        {tx.dataDecoded?.parameters.map((p, index) => getParameterElement(p, index))}
      </>
    )
  } else {
    // If we are dealing with a single tx
    // decodedTxData is of type DecodedData
    body = <>{tx.parameters.map((p, index) => getParameterElement(p, index))}</>
  }

  return <Container>{body}</Container>
}
