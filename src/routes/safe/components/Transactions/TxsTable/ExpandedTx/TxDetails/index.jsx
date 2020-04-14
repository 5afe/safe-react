// @flow
import { makeStyles } from '@material-ui/core/styles'
import cn from 'classnames'
import React from 'react'

import { styles } from './style'

import EtherScanLink from '~/components/EtherscanLink'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import Paragraph from '~/components/layout/Paragraph'
import Span from '~/components/layout/Span'
import { formatDate } from '~/routes/safe/components/Transactions/TxsTable/columns'
import { INCOMING_TX_TYPES } from '~/routes/safe/store/models/incomingTransaction'
import type { Transaction } from '~/routes/safe/store/models/transaction'

type Props = {
  tx: Transaction,
}

const useStyles = makeStyles(styles)

export const TxDetails = (props: Props) => {
  const { tx } = props
  const classes = useStyles()
  return (
    <Block className={cn(classes.txDataContainer, INCOMING_TX_TYPES.includes(tx.type) && classes.incomingTxBlock)}>
      <Block align="left" className={classes.txData}>
        <Bold className={classes.txHash}>Hash:</Bold>
        {tx.executionTxHash ? <EtherScanLink cut={8} type="tx" value={tx.executionTxHash} /> : 'n/a'}
      </Block>
      <Paragraph noMargin>
        <Bold>Nonce: </Bold>
        <Span>{tx.nonce}</Span>
      </Paragraph>
      <Paragraph noMargin>
        <Bold>Fee: </Bold>
        {tx.fee ? tx.fee : 'n/a'}
      </Paragraph>
      {INCOMING_TX_TYPES.includes(tx.type) ? (
        <>
          <Paragraph noMargin>
            <Bold>Created: </Bold>
            {formatDate(tx.executionDate)}
          </Paragraph>
        </>
      ) : (
        <>
          <Paragraph noMargin>
            <Bold>Created: </Bold>
            {formatDate(tx.submissionDate)}
          </Paragraph>
          {tx.executionDate && (
            <Paragraph noMargin>
              <Bold>Executed: </Bold>
              {formatDate(tx.executionDate)}
            </Paragraph>
          )}
          {tx.refundParams && (
            <Paragraph noMargin>
              <Bold>Refund: </Bold>
              max. {tx.refundParams.fee} {tx.refundParams.symbol}
            </Paragraph>
          )}
          {tx.operation === 1 && (
            <Paragraph noMargin>
              <Bold>Delegate Call</Bold>
            </Paragraph>
          )}
          {tx.operation === 2 && (
            <Paragraph noMargin>
              <Bold>Contract Creation</Bold>
            </Paragraph>
          )}
        </>
      )}
    </Block>
  )
}
