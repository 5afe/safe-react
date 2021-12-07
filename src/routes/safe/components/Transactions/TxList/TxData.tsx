import { TransactionData } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement, ReactNode } from 'react'

import { getNativeCurrency } from 'src/config'
import { ExpandedTxDetails, isCustomTxInfo } from 'src/logic/safe/store/models/types/gateway.d'
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
import { TransactionInfo } from '@gnosis.pm/safe-react-gateway-sdk'

type DetailsWithTxInfoProps = {
  children: ReactNode
  txData: TransactionData
  txInfo: TransactionInfo
}

const DetailsWithTxInfo = ({ children, txData, txInfo }: DetailsWithTxInfoProps): ReactElement => {
  const nativeCurrency = getNativeCurrency()
  const amount = txData.value ? fromTokenUnit(txData.value, nativeCurrency.decimals) : 'n/a'
  let name
  let avatarUrl

  if (isCustomTxInfo(txInfo)) {
    name = txInfo.to.name
    avatarUrl = txInfo.to.logoUri
  }

  return (
    <>
      <TxInfoDetails
        address={txData.to.value}
        name={name}
        avatarUrl={avatarUrl}
        title={`Send ${amount} ${nativeCurrency.symbol} to:`}
      />

      {children}
    </>
  )
}

type TxDataProps = {
  txData: ExpandedTxDetails['txData']
  txInfo: TransactionInfo
}

export const TxData = ({ txData, txInfo }: TxDataProps): ReactElement | null => {
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
      <DetailsWithTxInfo txData={txData} txInfo={txInfo}>
        <HexEncodedData title="Data (hex encoded)" hexData={txData.hexData} />
      </DetailsWithTxInfo>
    )
  }

  // known data and particularly `multiSend` data type
  if (sameString(txData.dataDecoded.method, 'multiSend')) {
    return <MultiSendDetails txData={txData} />
  }

  // FixMe: this way won't scale well
  if (isSetAllowance(txData.dataDecoded.method)) {
    return <ModifySpendingLimitDetails txData={txData} txInfo={txInfo} />
  }

  // FixMe: this way won't scale well
  if (isDeleteAllowance(txData.dataDecoded.method)) {
    return <DeleteSpendingLimitDetails txData={txData} txInfo={txInfo} />
  }

  // we render the decoded data
  return (
    <DetailsWithTxInfo txData={txData} txInfo={txInfo}>
      <MethodDetails data={txData.dataDecoded} />
    </DetailsWithTxInfo>
  )
}
