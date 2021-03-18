import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { getNetworkInfo } from 'src/config'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { md, lg } from 'src/theme/variables'
import ModalTitle from 'src/components/ModalTitle'
import Hairline from 'src/components/layout/Hairline'
import { DataDecodedParameterValue } from 'src/types/transactions/decode.d'
import { BasicTxInfo, getParameterElement } from 'src/components/DecodeTxs'

const { nativeCoin } = getNetworkInfo()

const Container = styled.div`
  max-width: 480px;
  padding: ${md} ${lg};
`

type Props = {
  hideDecodedTxData: () => void
  onClose: () => void
  decodedTxData: DataDecodedParameterValue
}

export const DecodedTxDetail = ({ hideDecodedTxData, onClose, decodedTxData: tx }: Props): ReactElement => {
  const txValue = fromTokenUnit(tx.value, nativeCoin.decimals)

  return (
    <>
      <ModalTitle title="Approve" onClose={onClose} goBack={hideDecodedTxData} />

      <Hairline />

      <Container>
        <BasicTxInfo txRecipient={tx.to} txData={tx.data} txValue={txValue} />
        {tx.dataDecoded?.parameters.map((p, index) => getParameterElement(p, index))}
      </Container>
    </>
  )
}
