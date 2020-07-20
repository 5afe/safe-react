import { IconText, Text } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import styled from 'styled-components'

import RenderValue from './RenderValues'
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
import { useSelector } from 'react-redux'
import { getNameFromAddressBook } from 'src/logic/addressBook/store/selectors'
import Paragraph from 'src/components/layout/Paragraph'
import LinkWithRef from 'src/components/layout/Link'
import { shortVersionOf } from 'src/logic/wallets/ethAddresses'

export const TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID = 'tx-description-custom-value'
export const TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID = 'tx-description-custom-data'

const useStyles = makeStyles(styles)

const TxDetailsMethodName = styled(Text)`
  text-indent: 4px;
`
const TxDetailsMethodParam = styled.div`
  text-indent: 8px;
`
const InlineText = styled(Text)`
  display: inline-flex;
`
const TxDetailsContent = styled.div`
  padding: 8px 8px 8px 16px;
`

const TxInfo = styled.div`
  padding: 8px 8px 8px 16px;
`

const MultiSigCustomData = ({ tx, order }): React.ReactElement => {
  const classes = useStyles()
  const methodName = tx.data?.method ? ` (${tx.data.method})` : ''

  return (
    <>
      <Collapse
        collapseClassName={classes.collapse}
        headerWrapperClassName={classes.collapseHeaderWrapper}
        title={<IconText iconSize="sm" iconType="code" text={`Interaction ${order + 1}${methodName}`} textSize="lg" />}
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
                  <RenderValue method={methodName} type={param.type} value={param.value} />
                </TxDetailsMethodParam>
              ))}
            </TxInfo>
          )}
        </TxDetailsContent>
      </Collapse>
    </>
  )
}

const TxData = ({ data }) => {
  const classes = useStyles()
  const [showTxData, setShowTxData] = React.useState(false)
  const showExpandBtn = data.length > 20

  return (
    <Paragraph className={classes.txDataParagraph} noMargin size="md">
      {showExpandBtn ? (
        <>
          {showTxData ? (
            <>
              {data}{' '}
              <LinkWithRef
                aria-label="Hide details of the transaction"
                className={classes.linkTxData}
                onClick={() => setShowTxData(false)}
                rel="noopener noreferrer"
                target="_blank"
              >
                Show Less
              </LinkWithRef>
            </>
          ) : (
            <>
              {shortVersionOf(data, 20)}{' '}
              <LinkWithRef
                aria-label="Show details of the transaction"
                className={classes.linkTxData}
                onClick={() => setShowTxData(true)}
                rel="noopener noreferrer"
                target="_blank"
              >
                Show More
              </LinkWithRef>
            </>
          )}
        </>
      ) : (
        data
      )}
    </Paragraph>
  )
}

const GenericCustomData = ({ amount = 0, data, recipient }: any) => {
  const classes = useStyles()
  const recipientName = useSelector((state) => getNameFromAddressBook(state, recipient))

  return (
    <Block>
      <Block data-testid={TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID}>
        <Bold>Send {amount} to:</Bold>
        {recipientName ? (
          <OwnerAddressTableCell address={recipient} knownAddress showLinks userName={recipientName} />
        ) : (
          <EtherscanLink knownAddress={false} type="address" value={recipient} />
        )}
      </Block>
      <Block className={classes.txData} data-testid={TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID}>
        <Bold>Data (hex encoded):</Bold>
        <TxData data={data} />
      </Block>
    </Block>
  )
}

const CustomDescription = ({ amount, data, recipient, rawTx }: any): React.ReactElement => {
  const classes = useStyles()

  return rawTx.multiSendTx ? (
    <Block className={classes.multiSendTxData} data-testid={TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID}>
      {extractMultiSendDecodedData(rawTx).txDetails?.map((tx, index) => {
        if (isMultiSendDetails(tx)) {
          return <MultiSigCustomData key={`${tx.to}-row-${index}`} tx={tx} order={index} />
        }
      })}
    </Block>
  ) : (
    <GenericCustomData amount={amount} data={data} recipient={recipient} />
  )
}

export default CustomDescription
