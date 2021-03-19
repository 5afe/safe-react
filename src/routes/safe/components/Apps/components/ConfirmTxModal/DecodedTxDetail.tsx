import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { getNetworkInfo } from 'src/config'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { md, lg } from 'src/theme/variables'
import ModalTitle from 'src/components/ModalTitle'
import Hairline from 'src/components/layout/Hairline'
import { DecodedDataParameterValue, DecodedData } from 'src/types/transactions/decode.d'
import { BasicTxInfo, getParameterElement } from 'src/components/DecodeTxs'

const { nativeCoin } = getNetworkInfo()

const Container = styled.div`
  max-width: 480px;
  padding: ${md} ${lg};
  word-break: break-word;
`

function isDataDecodedParameterValue(arg: any): arg is DecodedDataParameterValue {
  return arg.operation !== undefined
}

type Props = {
  hideDecodedTxData: () => void
  onClose: () => void
  decodedTxData: DecodedDataParameterValue | DecodedData
}

export const DecodedTxDetail = ({ hideDecodedTxData, onClose, decodedTxData: tx }: Props): ReactElement => {
  let body
  // If we are dealing with a multiSend
  // decodedTxData is of type DataDecodedParameter
  if (isDataDecodedParameterValue(tx)) {
    const txValue = fromTokenUnit(tx.value, nativeCoin.decimals)

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

  return (
    <>
      <ModalTitle
        title={(tx as DecodedDataParameterValue).dataDecoded?.method || (tx as DecodedData).method}
        onClose={onClose}
        goBack={hideDecodedTxData}
      />

      <Hairline />

      <Container>{body}</Container>
    </>
  )
}
