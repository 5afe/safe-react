// @flow
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useSelector } from 'react-redux'

import EtherscanLink from '~/components/EtherscanLink'
import Block from '~/components/layout/Block'
import Bold from '~/components/layout/Bold'
import { getNameFromAddressBook } from '~/logic/addressBook/store/selectors'
import OwnerAddressTableCell from '~/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import { getIncomingTxAmount } from '~/routes/safe/components/Transactions/TxsTable/columns'
import type { IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import { lg, md } from '~/theme/variables'

export const TRANSACTIONS_DESC_INCOMING_TEST_ID = 'tx-description-incoming'

const useStyles = makeStyles({
  txDataContainer: {
    paddingTop: lg,
    paddingLeft: md,
    paddingBottom: md,
    borderRight: '2px solid rgb(232, 231, 230)',
  },
})

type Props = {
  tx: IncomingTransaction,
}

type TransferDescProps = {
  value: string,
  from: string,
  txFromName?: string,
}

const TransferDescription = ({ from, txFromName, value = '' }: TransferDescProps) => (
  <Block data-testid={TRANSACTIONS_DESC_INCOMING_TEST_ID}>
    <Bold>Received {value} from:</Bold>
    <br />
    {txFromName ? (
      <OwnerAddressTableCell address={from} knownAddress showLinks userName={txFromName} />
    ) : (
      <EtherscanLink knownAddress={false} type="address" value={from} />
    )}
  </Block>
)

const IncomingTxDescription = ({ tx }: Props) => {
  const classes = useStyles()
  const txFromName = useSelector((state) => getNameFromAddressBook(state, tx.from))
  return (
    <Block className={classes.txDataContainer}>
      <TransferDescription from={tx.from} txFromName={txFromName} value={getIncomingTxAmount(tx)} />
    </Block>
  )
}

export default IncomingTxDescription
