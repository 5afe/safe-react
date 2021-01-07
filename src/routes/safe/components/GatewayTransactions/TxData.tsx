import { Accordion, AccordionSummary, IconText, Text } from '@gnosis.pm/safe-react-components'
import React, { ReactElement } from 'react'
import { getNetworkInfo } from 'src/config'

import { DataDecoded, ExpandedTxDetails } from 'src/logic/safe/store/models/types/gateway.d'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'
import { isArrayParameter } from 'src/routes/safe/components/Balances/SendModal/screens/ContractInteraction/utils'
import { ColumnLikeAccordionDetails } from 'src/routes/safe/components/GatewayTransactions/styled'
import { TxInfoDetails } from 'src/routes/safe/components/GatewayTransactions/TxInfoDetails'
import { TxData as LegacyTxData } from 'src/routes/safe/components/Transactions/TxsTable/ExpandedTx/TxDescription/CustomDescription'
import Value from 'src/routes/safe/components/Transactions/TxsTable/ExpandedTx/TxDescription/Value'
import styled from 'styled-components'

const TxDetailsMethodName = styled(Text)`
  text-indent: 4px;
`
const TxDetailsMethodParam = styled.div<{ isArrayParameter: boolean }>`
  padding-left: 8px;
  display: ${({ isArrayParameter }) => (isArrayParameter ? 'block' : 'flex')};
  align-items: center;

  p:first-of-type {
    margin-right: ${({ isArrayParameter }) => (isArrayParameter ? '0' : '4px')};
  }
`

// const TxDetailsContent = styled.div`
//   padding: 8px 8px 8px 16px;
//   overflow-wrap: break-word;
// `

const TxInfo = styled.div`
  padding: 8px 8px 8px 16px;
`

const StyledMethodName = styled(Text)`
  white-space: nowrap;
`

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

const TxInfoMethodDetails = ({ data }: { data: DataDecoded }): React.ReactElement => (
  <TxInfo>
    <TxDetailsMethodName size="lg" strong>
      {data.method}
    </TxDetailsMethodName>

    {data.parameters?.map((param, index) => (
      <TxDetailsMethodParam key={`${data.method}_param-${index}`} isArrayParameter={isArrayParameter(param.type)}>
        <StyledMethodName size="lg" strong>
          {param.name}({param.type}):
        </StyledMethodName>
        <Value method={data.method} type={param.type} value={param.value} />
      </TxDetailsMethodParam>
    ))}
  </TxInfo>
)

const { nativeCoin } = getNetworkInfo()

type TxDataProps = {
  txData: ExpandedTxDetails['txData']
}

export const TxData = ({ txData }: TxDataProps): ReactElement | null => {
  if (!txData) {
    return null
  }

  if (!txData.dataDecoded) {
    if (!txData.hexData) {
      return null
    }

    return (
      <div className="tx-hexData">
        <Text size="md" strong>
          Data (hex encoded):
        </Text>
        <LegacyTxData data={txData.hexData} />
      </div>
    )
  }

  if (txData.dataDecoded.method === 'multiSend') {
    if (!txData.dataDecoded.parameters) {
      return null
    }

    return (
      <>
        {txData.dataDecoded.parameters[0].valueDecoded?.map(({ dataDecoded }, index, valuesDecoded) => {
          let details
          const { data, value, to } = valuesDecoded[index]
          const amount = value ? fromTokenUnit(value, nativeCoin.decimals) : 0
          const title = `Send ${amount} ${nativeCoin.name} to:`

          if (dataDecoded) {
            details = (
              <MultiSendAccordion>
                <AccordionSummary>
                  <IconText
                    iconSize="sm"
                    iconType="code"
                    text={`Action ${index + 1} (${dataDecoded.method})`}
                    textSize="lg"
                  />
                </AccordionSummary>
                <ColumnLikeAccordionDetails>
                  <TxInfoDetails title={title} address={to} />
                  <TxInfoMethodDetails data={dataDecoded} />
                </ColumnLikeAccordionDetails>
              </MultiSendAccordion>
            )
          } else {
            details = (
              <MultiSendAccordion>
                <AccordionSummary>
                  <IconText iconSize="sm" iconType="code" text={`Action ${index + 1}`} textSize="lg" />
                </AccordionSummary>
                <ColumnLikeAccordionDetails>
                  <TxInfoDetails title={title} address={to} />
                  {data && (
                    <div className="tx-hexData">
                      <Text size="md" strong>
                        Data (hex encoded):
                      </Text>
                      <LegacyTxData data={data} />
                    </div>
                  )}
                </ColumnLikeAccordionDetails>
              </MultiSendAccordion>
            )
          }

          return <React.Fragment key={`${data}-${index}`}>{details}</React.Fragment>
        })}
      </>
    )
  }

  return <TxInfoMethodDetails data={txData.dataDecoded} />
}
