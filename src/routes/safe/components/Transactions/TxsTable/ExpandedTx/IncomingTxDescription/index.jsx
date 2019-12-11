// @flow
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import type { IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import Bold from '~/components/layout/Bold'
import EtherscanLink from '~/components/EtherscanLink'
import Paragraph from '~/components/layout/Paragraph'
import Block from '~/components/layout/Block'
import { md, lg } from '~/theme/variables'
import { getIncomingTxAmount } from '~/routes/safe/components/Transactions/TxsTable/columns'

export const TRANSACTIONS_DESC_INCOMING_TEST_ID = 'tx-description-incoming'

const useStyles = makeStyles({
  txDataContainer: {
    padding: `${lg} ${md}`,
    borderRight: '2px solid rgb(232, 231, 230)',
  },
})

type Props = {
  tx: IncomingTransaction,
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

const IncomingTxDescription = ({ tx }: Props) => {
  const classes = useStyles()

  return (
    <Block className={classes.txDataContainer}>
      <TransferDescription value={getIncomingTxAmount(tx)} from={tx.from} />
    </Block>
  )
}

export default IncomingTxDescription
