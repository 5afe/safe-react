import { IconText, Text } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import styled from 'styled-components'
import React from 'react'

import { styles } from './styles'

import Block from 'src/components/layout/Block'
import {
  extractMultiSendDecodedData,
  isMultiSendDetails,
} from 'src/routes/safe/store/actions/transactions/utils/multiSendDecodedDetails'
import Bold from 'src/components/layout/Bold'
import OwnerAddressTableCell from 'src/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import EtherscanLink from 'src/components/EtherscanLink'
import { humanReadableValue } from 'src/utils/humanReadableValue'
import Collapse from 'src/components/Collapse'

export const TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID = 'tx-description-custom-value'
export const TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID = 'tx-description-custom-data'

const useStyles = makeStyles(styles)

const TxDetailsMethodName = styled(Text)`
  text-indent: 2%;
`
const TxDetailsMethodParam = styled.div`
  text-indent: 4%;
`
const InlineText = styled(Text)`
  display: inline-flex;
  margin-right: 6px;
`
const TxDetailsContent = styled.div`
  padding: 8px 8px 8px 16px;
`

const TxInfo = styled.div`
  padding: 8px 8px 8px 16px;
`

const CustomDescription = ({ rawTx }: { rawTx: any }): React.ReactElement => {
  const classes = useStyles()

  return (
    <Block className={classes.multiSendTxData} data-testid={TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID}>
      {extractMultiSendDecodedData(rawTx).txDetails?.map((tx, index) => {
        if (isMultiSendDetails(tx)) {
          const usedMethod = tx.data?.method ? ` (${tx.data.method})` : ''

          return (
            <React.Fragment key={`${tx.to}-row-${index}`}>
              <Collapse
                collapseClassName={classes.collapse}
                headerWrapperClassName={classes.collapseHeaderWrapper}
                title={
                  <IconText
                    iconSize="sm"
                    iconType="code"
                    text={`Interaction ${index + 1}${usedMethod}`}
                    textSize="lg"
                  />
                }
              >
                <TxDetailsContent>
                  <TxInfo>
                    <Bold>Send {humanReadableValue(tx.value)} ETH to:</Bold>
                    <OwnerAddressTableCell address={tx.to} showLinks />
                  </TxInfo>
                  {tx.data && (
                    <TxInfo>
                      <TxDetailsMethodName size="lg">
                        <strong>{tx.data.method}</strong>
                      </TxDetailsMethodName>
                      {tx.data?.parameters.map((param, index) => (
                        <TxDetailsMethodParam key={`${tx.operation}_${tx.to}_${tx.data.method}_param-${index}`}>
                          <InlineText size="lg">
                            <strong>
                              {param.name}({param.type}):
                            </strong>
                          </InlineText>
                          {param.type === 'address' ? (
                            <EtherscanLink cut={8} value={param.value} />
                          ) : (
                            <InlineText size="lg">{param.value}</InlineText>
                          )}
                        </TxDetailsMethodParam>
                      ))}
                    </TxInfo>
                  )}
                </TxDetailsContent>
              </Collapse>
            </React.Fragment>
          )
        }
      })}
    </Block>
  )
}

export default CustomDescription
