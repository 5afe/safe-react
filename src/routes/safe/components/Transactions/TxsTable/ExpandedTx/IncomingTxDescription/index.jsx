// 
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import EtherscanLink from 'components/EtherscanLink'
import Block from 'components/layout/Block'
import Bold from 'components/layout/Bold'
import { GetNameFromAddressBook } from 'logic/addressBook/utils'
import OwnerAddressTableCell from 'routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import { getIncomingTxAmount } from 'routes/safe/components/Transactions/TxsTable/columns'
import { lg, md } from 'theme/variables'

export const TRANSACTIONS_DESC_INCOMING_TEST_ID = 'tx-description-incoming'

const useStyles = makeStyles({
  txDataContainer: {
    paddingTop: lg,
    paddingLeft: md,
    paddingBottom: md,
    borderRight: '2px solid rgb(232, 231, 230)',
  },
})



const TransferDescription = ({ from, txFromName, value = '' }) => (
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

const IncomingTxDescription = ({ tx }) => {
  const classes = useStyles()
  const txFromName = GetNameFromAddressBook(tx.from)
  return (
    <Block className={classes.txDataContainer}>
      <TransferDescription from={tx.from} txFromName={txFromName} value={getIncomingTxAmount(tx)} />
    </Block>
  )
}

export default IncomingTxDescription
