import { makeStyles } from '@material-ui/core/styles'
import React, { ReactElement } from 'react'
import { useSelector } from 'react-redux'

import { EtherscanLink } from 'src/components/EtherscanLink'
import Block from 'src/components/layout/Block'
import Bold from 'src/components/layout/Bold'
import { getNameFromAddressBookSelector } from 'src/logic/addressBook/store/selectors'
import { Transfer } from 'src/logic/safe/store/models/types/gateway.d'
import OwnerAddressTableCell from 'src/routes/safe/components/Settings/ManageOwners/OwnerAddressTableCell'
import { getIncomingTxAmount } from 'src/routes/safe/components/Transactions/TxsTable/columns'
import { lg, md } from 'src/theme/variables'

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
      <EtherscanLink knownAddress={false} value={from} />
    )}
  </Block>
)

const IncomingTxDescription = ({ transferTx }: { transferTx: Transfer }): ReactElement => {
  const classes = useStyles()
  const txFromName = useSelector((state) => getNameFromAddressBookSelector(state, transferTx.sender))

  return (
    <Block className={classes.txDataContainer}>
      <TransferDescription
        from={transferTx.sender}
        txFromName={txFromName}
        value={getIncomingTxAmount(transferTx, false)}
      />
    </Block>
  )
}

export default IncomingTxDescription
