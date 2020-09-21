import { IconText, Text } from '@gnosis.pm/safe-react-components'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import styled from 'styled-components'

import { styles } from './styles'
import Value from './Value'

import Block from 'src/components/layout/Block'
import {
  extractMultiSendDataDecoded,
  MultiSendDetails,
} from 'src/routes/safe/store/actions/transactions/utils/multiSendDecodedDetails'
import Bold from 'src/components/layout/Bold'
import OwnerAddressTableCell from 'src/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import EtherscanLink from 'src/components/EtherscanLink'
import { humanReadableValue } from 'src/logic/tokens/utils/humanReadableValue'
import Collapse from 'src/components/Collapse'
import { useSelector } from 'react-redux'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'
import Paragraph from 'src/components/layout/Paragraph'
import LinkWithRef from 'src/components/layout/Link'
import { shortVersionOf } from 'src/logic/wallets/ethAddresses'
import { Transaction } from 'src/logic/safe/store/models/types/transaction'
import { DataDecoded } from 'src/routes/safe/store/models/types/transactions.d'
import DividerLine from 'src/components/DividerLine'

export const TRANSACTIONS_DESC_CUSTOM_VALUE_TEST_ID = 'tx-description-custom-value'
export const TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID = 'tx-description-custom-data'
export const TRANSACTION_DESC_ACTION_TEST_ID = 'tx-description-action-data'

const useStyles = makeStyles(styles)

const TxDetailsMethodName = styled(Text)`
  text-indent: 4px;
`
const TxDetailsMethodParam = styled.div`
  text-indent: 8px;
  display: flex;
`
const TxDetailsContent = styled.div`
  padding: 8px 8px 8px 16px;
`

const TxInfo = styled.div`
  padding: 8px 8px 8px 16px;
`

const TxInfoDetails = ({ data }: { data: DataDecoded }): React.ReactElement => (
  <TxInfo>
    <TxDetailsMethodName size="lg" strong>
      {data.method}
    </TxDetailsMethodName>

    {data.parameters.map((param, index) => (
      <TxDetailsMethodParam key={`${data.method}_param-${index}`}>
        <Text size="lg" strong>
          {param.name}({param.type}):
        </Text>
        <Value method={data.method} type={param.type} value={param.value} />
      </TxDetailsMethodParam>
    ))}
  </TxInfo>
)

const MultiSendCustomDataAction = ({ tx, order }: { tx: MultiSendDetails; order: number }): React.ReactElement => {
  const classes = useStyles()
  const methodName = tx.data?.method ? ` (${tx.data.method})` : ''

  return (
    <Collapse
      collapseClassName={classes.collapse}
      headerWrapperClassName={classes.collapseHeaderWrapper}
      title={<IconText iconSize="sm" iconType="code" text={`Action ${order + 1}${methodName}`} textSize="lg" />}
    >
      <TxDetailsContent>
        <TxInfo>
          <Bold>Send {humanReadableValue(tx.value)} ETH to:</Bold>
          <OwnerAddressTableCell address={tx.to} showLinks />
        </TxInfo>

        {!!tx.data && <TxInfoDetails data={tx.data} />}
      </TxDetailsContent>
    </Collapse>
  )
}

const MultiSendCustomData = ({ txDetails }: { txDetails: MultiSendDetails[] }): React.ReactElement => {
  const classes = useStyles()

  return (
    <Block className={classes.multiSendTxData} data-testid={TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID}>
      {txDetails.map((tx, index) => (
        <MultiSendCustomDataAction key={`${tx.to}-row-${index}`} tx={tx} order={index} />
      ))}
    </Block>
  )
}

const TxData = ({ data }: { data: string }): React.ReactElement => {
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

const TxActionData = ({ dataDecoded }: { dataDecoded: DataDecoded }): React.ReactElement => {
  const classes = useStyles()

  return (
    <>
      <DividerLine withArrow={false} />

      <Block className={classes.txData} data-testid={TRANSACTION_DESC_ACTION_TEST_ID}>
        <Bold>Action</Bold>
        <TxInfoDetails data={dataDecoded} />
      </Block>

      <DividerLine withArrow={false} />
    </>
  )
}

interface GenericCustomDataProps {
  amount?: string
  data: string
  recipient: string
  storedTx: Transaction
}

const GenericCustomData = ({ amount = '0', data, recipient, storedTx }: GenericCustomDataProps): React.ReactElement => {
  const classes = useStyles()
  const recipientName = useSelector((state) => getNameFromAddressBookSelector(state, recipient))

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

      {!!storedTx?.dataDecoded && <TxActionData dataDecoded={storedTx.dataDecoded} />}

      <Block className={classes.txData} data-testid={TRANSACTIONS_DESC_CUSTOM_DATA_TEST_ID}>
        <Bold>Data (hex encoded):</Bold>
        <TxData data={data} />
      </Block>
    </Block>
  )
}

interface CustomDescriptionProps {
  amount?: string
  data: string
  recipient: string
  storedTx: Transaction
}

const CustomDescription = ({ amount, data, recipient, storedTx }: CustomDescriptionProps): React.ReactElement => {
  const txDetails = (storedTx.multiSendTx && extractMultiSendDataDecoded(storedTx).txDetails) ?? undefined

  return txDetails ? (
    <MultiSendCustomData txDetails={txDetails} />
  ) : (
    <GenericCustomData amount={amount} data={data} recipient={recipient} storedTx={storedTx} />
  )
}

export default CustomDescription
