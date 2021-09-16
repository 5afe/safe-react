import { AccordionSummary, IconText } from '@gnosis.pm/safe-react-components'
import { DataDecoded, TransactionData } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement, ReactNode } from 'react'

import { getNetworkInfo } from 'src/config'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { HexEncodedData } from './HexEncodedData'
import { MethodDetails } from './MethodDetails'
import { isSpendingLimitMethod } from './SpendingLimitDetails'
import { ColumnDisplayAccordionDetails, ActionAccordion } from './styled'
import { TxInfoDetails } from './TxInfoDetails'

type MultiSendTxGroupProps = {
  actionTitle: string
  children: ReactNode
  txDetails: {
    title: string
    address: string
    dataDecoded: DataDecoded | null
  }
}

const MultiSendTxGroup = ({ actionTitle, children, txDetails }: MultiSendTxGroupProps): ReactElement => {
  return (
    <ActionAccordion>
      <AccordionSummary>
        <IconText iconSize="sm" iconType="code" text={actionTitle} textSize="xl" />
      </AccordionSummary>
      <ColumnDisplayAccordionDetails>
        {!isSpendingLimitMethod(txDetails.dataDecoded?.method) && (
          <TxInfoDetails title={txDetails.title} address={txDetails.address} />
        )}
        {children}
      </ColumnDisplayAccordionDetails>
    </ActionAccordion>
  )
}

const { nativeCoin } = getNetworkInfo()

export const MultiSendDetails = ({ txData }: { txData: TransactionData }): ReactElement | null => {
  // no parameters for the `multiSend`
  if (!txData.dataDecoded?.parameters) {
    // we render the hex encoded data
    if (txData.hexData) {
      return <HexEncodedData title="Data (hex encoded)" hexData={txData.hexData} />
    }

    return null
  }

  // multiSend has one parameter `transactions` therefore `txData.dataDecoded.parameters[0]` is safe to be used here
  return (
    <>
      {txData.dataDecoded.parameters[0].valueDecoded?.map(({ dataDecoded }, index, valuesDecoded) => {
        let details
        const { data, value, to } = valuesDecoded[index]
        const actionTitle = `Action ${index + 1} ${dataDecoded ? `(${dataDecoded.method})` : ''}`
        const amount = value ? fromTokenUnit(value, nativeCoin.decimals) : 0
        const title = `Send ${amount} ${nativeCoin.name} to:`

        if (dataDecoded) {
          // Backend decoded data
          details = <MethodDetails data={dataDecoded} />
        } else {
          // We couldn't decode it but we have data
          details = data && <HexEncodedData title="Data (hex encoded)" hexData={data} />
        }

        return (
          <MultiSendTxGroup
            key={`${data ?? to}-${index}`}
            actionTitle={actionTitle}
            txDetails={{ title, address: to, dataDecoded }}
          >
            {details}
          </MultiSendTxGroup>
        )
      })}
    </>
  )
}
