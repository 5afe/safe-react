// @flow
import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import type { IncomingTransaction } from '~/routes/safe/store/models/incomingTransaction'
import Bold from '~/components/layout/Bold'
import EtherscanLink from '~/components/EtherscanLink'
import Block from '~/components/layout/Block'
import { md, lg } from '~/theme/variables'
import { getIncomingTxAmount } from '~/routes/safe/components/Transactions/TxsTable/columns'
import OwnerAddressTableCell from '~/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import { getNameFromAddressBook } from '~/logic/addressBook/utils'

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

const TransferDescription = ({ value = '', from, txFromName }: TransferDescProps) => (
  <Block data-testid={TRANSACTIONS_DESC_INCOMING_TEST_ID}>
    <Bold>Received {value} from:</Bold>
    <br />
    {txFromName ? (
      <OwnerAddressTableCell address={from} showLinks userName={txFromName} knownAddress />
    ) : (
      <EtherscanLink type="address" value={from} knownAddress={false} />
    )}
  </Block>
)

const IncomingTxDescription = ({ tx }: Props) => {
  const classes = useStyles()
  const txFromName = getNameFromAddressBook(tx.from)
  return (
    <Block className={classes.txDataContainer}>
      <TransferDescription value={getIncomingTxAmount(tx)} from={tx.from} txFromName={txFromName} />
    </Block>
  )
}

export default IncomingTxDescription
