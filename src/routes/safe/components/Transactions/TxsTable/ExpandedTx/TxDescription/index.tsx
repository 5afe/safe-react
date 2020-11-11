import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { styles } from './styles'
import { getTxData } from './utils'
import SettingsDescription from './SettingsDescription'
import CustomDescription from './CustomDescription'
import TransferDescription from './TransferDescription'

import { getRawTxAmount, getTxAmount } from 'src/routes/safe/components/Transactions/TxsTable/columns'
import Block from 'src/components/layout/Block'
import { Transaction } from 'src/logic/safe/store/models/types/transaction'

export const TRANSACTIONS_DESC_SEND_TEST_ID = 'tx-description-send'

const useStyles = makeStyles(styles)

const TxDescription = ({ tx }: { tx: Transaction }): React.ReactElement => {
  const classes = useStyles()
  const {
    action,
    addedOwner,
    cancellationTx,
    creationTx,
    customTx,
    data,
    modifySettingsTx,
    module,
    newThreshold,
    recipient,
    removedOwner,
    upgradeTx,
    tokenAddress,
    isTokenTransfer,
  }: any = getTxData(tx)

  const amountWithSymbol = getTxAmount(tx, false)
  const amount = getRawTxAmount(tx)
  return (
    <Block className={classes.txDataContainer}>
      {modifySettingsTx && action && (
        <SettingsDescription
          action={action}
          addedOwner={addedOwner}
          newThreshold={newThreshold}
          removedOwner={removedOwner}
          module={module}
        />
      )}
      {!upgradeTx && customTx && (
        <CustomDescription amount={amountWithSymbol} data={data} recipient={recipient} storedTx={tx} />
      )}
      {upgradeTx && <div>{data}</div>}
      {!cancellationTx && !modifySettingsTx && !customTx && !creationTx && !upgradeTx && (
        <TransferDescription
          amountWithSymbol={amountWithSymbol}
          recipient={recipient}
          tokenAddress={tokenAddress}
          rawAmount={amount}
          isTokenTransfer={isTokenTransfer}
        />
      )}
    </Block>
  )
}

export default TxDescription
