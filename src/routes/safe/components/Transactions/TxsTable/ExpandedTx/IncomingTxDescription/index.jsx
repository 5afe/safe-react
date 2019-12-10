// @flow
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { type Transaction } from '~/routes/safe/store/models/transaction'
import Bold from '~/components/layout/Bold'
import EtherscanLink from '~/components/EtherscanLink'
import Paragraph from '~/components/layout/Paragraph'
import Block from '~/components/layout/Block'
import { md, lg } from '~/theme/variables'
import { getIncomingTxAmount } from '~/routes/safe/components/Transactions/TxsTable/columns'

export const TRANSACTIONS_DESC_INCOMING_TEST_ID = 'tx-description-incoming'

export const styles = () => ({
  txDataContainer: {
    padding: `${lg} ${md}`,
    borderRight: '2px solid rgb(232, 231, 230)',
  },
  txData: {
    wordBreak: 'break-all',
  },
})

type Props = {
  classes: Object,
  tx: Transaction,
}

type TransferDescProps = {
  value: string,
  from: string,
}

const TransferDescription = ({ value = '', from }: TransferDescProps) => (
  <Paragraph noMargin data-testid={TRANSACTIONS_DESC_INCOMING_TEST_ID}>
    <Bold>
      Received
      {' '}
      {value}
      {' '}
      from:
    </Bold>
    <br />
    <EtherscanLink type="address" value={from} />
  </Paragraph>
)

const IncomingTxDescription = ({ tx, classes }: Props) => (
  <Block className={classes.txDataContainer}>
    <TransferDescription value={getIncomingTxAmount(tx)} from={tx.from} />
  </Block>
)

export default withStyles(styles)(IncomingTxDescription)
