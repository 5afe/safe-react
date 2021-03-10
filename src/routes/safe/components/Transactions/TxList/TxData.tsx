import React, { ReactElement, ReactNode } from 'react'

import { getNetworkInfo } from 'src/config'
import { ExpandedTxDetails, TransactionData } from 'src/logic/safe/store/models/types/gateway.d'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import {
  DeleteSpendingLimitDetails,
  isDeleteAllowance,
  isSetAllowance,
  ModifySpendingLimitDetails,
} from './SpendingLimitDetails'
import { TxInfoDetails } from './TxInfoDetails'
import { sameString } from 'src/utils/strings'
import { HexEncodedData } from './HexEncodedData'
import { MethodDetails } from './MethodDetails'
import { MultiSendDetails } from './MultiSendDetails'

const { nativeCoin } = getNetworkInfo()

type DetailsWithTxInfoProps = {
  children: ReactNode
  txData: TransactionData
}

const DetailsWithTxInfo = ({ children, txData }: DetailsWithTxInfoProps): ReactElement => (
  <>
    <TxInfoDetails
      address={txData.to}
      title={`Send ${txData.value ? fromTokenUnit(txData.value, nativeCoin.decimals) : 'n/a'} ${nativeCoin.symbol} to:`}
    />
    {children}
  </>
)

type TxDataProps = {
  txData: ExpandedTxDetails['txData']
}

export const TxData = ({ txData }: TxDataProps): ReactElement | null => {
  // nothing to render
  if (!txData) {
    return null
  }

  // unknown tx information
  if (!txData.dataDecoded) {
    // no hex data, nothing to render
    if (!txData.hexData) {
      return null
    }

    // we render the hex encoded data
    return (
      <DetailsWithTxInfo txData={txData}>
        <HexEncodedData hexData={txData.hexData} />
      </DetailsWithTxInfo>
    )
  }

  // known data and particularly `multiSend` data type
  if (sameString(txData.dataDecoded.method, 'multiSend')) {
    return <MultiSendDetails txData={txData} />
  }

  // FixMe: this way won't scale well
  if (isSetAllowance(txData.dataDecoded.method)) {
    return <ModifySpendingLimitDetails data={txData.dataDecoded} />
  }

  // FixMe: this way won't scale well
  if (isDeleteAllowance(txData.dataDecoded.method)) {
    return <DeleteSpendingLimitDetails data={txData.dataDecoded} />
  }

  // we render the decoded data
  return (
    <DetailsWithTxInfo txData={txData}>
      <MethodDetails data={txData.dataDecoded} />
    </DetailsWithTxInfo>
  )
}
