import { AccordionSummary, IconText, Text } from '@gnosis.pm/safe-react-components'
import { DataDecoded, Operation, TransactionData } from '@gnosis.pm/safe-react-gateway-sdk'
import { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { getNativeCurrency } from 'src/config'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { getInteractionTitle } from '../helpers/utils'
import DelegateCallWarning from './DelegateCallWarning'
import { HexEncodedData } from './HexEncodedData'
import { MethodDetails } from './MethodDetails'
import { isSpendingLimitMethod } from './SpendingLimitDetails'
import { ColumnDisplayAccordionDetails, ActionAccordion } from './styled'
import { TxInfoDetails } from './TxInfoDetails'
import { sm } from 'src/theme/variables'

const StyledText = styled(Text)`
  margin-left: ${sm};
`

type MultiSendTxGroupProps = {
  actionTitle: string
  method: string
  children: ReactNode
  txDetails: {
    title: string
    address: string
    name?: string | undefined
    avatarUrl?: string | undefined
    dataDecoded: DataDecoded | null
    operation: Operation
  }
}

const MultiSendTxGroup = ({ actionTitle, method, children, txDetails }: MultiSendTxGroupProps): ReactElement => {
  const isDelegateCall = txDetails.operation === Operation.DELEGATE
  return (
    <ActionAccordion defaultExpanded={isDelegateCall || undefined}>
      <AccordionSummary>
        <IconText iconSize="sm" iconType="code" text={actionTitle} textSize="xl" />
        <StyledText size="xl" strong>
          {method}
        </StyledText>
      </AccordionSummary>
      <ColumnDisplayAccordionDetails>
        {/* We always warn of nested delegate calls */}
        {isDelegateCall && <DelegateCallWarning showWarning={isDelegateCall} />}
        {!isSpendingLimitMethod(txDetails.dataDecoded?.method) && (
          <TxInfoDetails
            title={txDetails.title}
            address={txDetails.address}
            name={txDetails.name}
            avatarUrl={txDetails.avatarUrl}
          />
        )}
        {children}
      </ColumnDisplayAccordionDetails>
    </ActionAccordion>
  )
}

export const MultiSendDetails = ({ txData }: { txData: TransactionData }): ReactElement | null => {
  const nativeCurrency = getNativeCurrency()
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
        const { data, value, to, operation } = valuesDecoded[index]

        const actionTitle = `Action ${index + 1}`
        const method = `${dataDecoded ? `${dataDecoded.method}` : ''}`
        const amount = value ? fromTokenUnit(value, nativeCurrency.decimals) : 0
        const title = getInteractionTitle(amount)

        if (dataDecoded) {
          // Backend decoded data
          details = <MethodDetails data={dataDecoded} />
        } else {
          // We couldn't decode it but we have data
          details = data && <HexEncodedData title="Data (hex encoded)" hexData={data} />
        }

        const addressInfo = txData.addressInfoIndex?.[to]
        const name = addressInfo?.name || undefined
        const avatarUrl = addressInfo?.logoUri || undefined

        return (
          <MultiSendTxGroup
            key={`${data ?? to}-${index}`}
            actionTitle={actionTitle}
            method={method}
            txDetails={{ title, address: to, dataDecoded, name, avatarUrl, operation }}
          >
            {details}
          </MultiSendTxGroup>
        )
      })}
    </>
  )
}
