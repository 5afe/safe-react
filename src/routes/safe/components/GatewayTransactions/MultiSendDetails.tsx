import { Accordion, AccordionSummary, IconText } from '@gnosis.pm/safe-react-components'
import React, { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { getNetworkInfo } from 'src/config'
import { TransactionData } from 'src/logic/safe/store/models/types/gateway.d'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { ColumnLikeAccordionDetails } from './styled'
import { TxInfoDetails } from './TxInfoDetails'
import { MethodDetails } from './MethodDetails'
import { HexEncodedData } from './HexEncodedData'

const MultiSendAccordion = styled(Accordion)`
  &.MuiAccordion-root {
    &:first-child {
      border-top: none;
    }

    &.Mui-expanded {
      &:last-child {
        border-bottom: none;
      }
    }

    & .MuiAccordionDetails-root {
      padding: 16px;
    }
  }
`

type MultiSendTxGroupProps = {
  actionTitle: string
  children: ReactNode
  txDetails: {
    title: string
    address: string
  }
}

const MultiSendTxGroup = ({ actionTitle, children, txDetails }: MultiSendTxGroupProps): ReactElement => {
  return (
    <MultiSendAccordion>
      <AccordionSummary>
        <IconText iconSize="sm" iconType="code" text={actionTitle} textSize="lg" />
      </AccordionSummary>
      <ColumnLikeAccordionDetails>
        <TxInfoDetails title={txDetails.title} address={txDetails.address} />
        {children}
      </ColumnLikeAccordionDetails>
    </MultiSendAccordion>
  )
}

const { nativeCoin } = getNetworkInfo()

export const MultiSendDetails = ({ txData }: { txData: TransactionData }): ReactElement | null => {
  // no parameters for the `multiSend`
  if (!txData.dataDecoded?.parameters) {
    // we render the hex encoded data
    if (txData.hexData) {
      return <HexEncodedData hexData={txData.hexData} />
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
          details = <MethodDetails data={dataDecoded} />
        } else {
          details = data && <HexEncodedData hexData={data} />
        }

        return (
          details && (
            <React.Fragment key={`${data ?? to}-${index}`}>
              <MultiSendTxGroup actionTitle={actionTitle} txDetails={{ title, address: to }}>
                {details}
              </MultiSendTxGroup>
            </React.Fragment>
          )
        )
      })}
    </>
  )
}
