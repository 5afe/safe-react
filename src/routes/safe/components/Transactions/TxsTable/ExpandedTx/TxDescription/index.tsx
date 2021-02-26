import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { styles } from './styles'
import { getTxData } from './utils'
import SettingsDescription from './SettingsDescription'
import CustomDescription from './CustomDescription'
import TransferDescription from './TransferDescription'

import { getRawTxAmount, getTxAmount } from 'src/routes/safe/components/Transactions/TxsTable/columns'
import Block from 'src/components/layout/Block'
import { Transaction, TransactionTypes } from 'src/logic/safe/store/models/types/transaction'

export const TRANSACTIONS_DESC_SEND_TEST_ID = 'tx-description-send'

const useStyles = makeStyles(styles)

const SettingsDescriptionTx = ({ tx }: { tx: Transaction }): React.ReactElement => {
  const { action, addedOwner, module, newThreshold, removedOwner } = getTxData(tx)
  return <SettingsDescription {...{ action, addedOwner, module, newThreshold, removedOwner }} />
}

const CustomDescriptionTx = ({ tx }: { tx: Transaction }): React.ReactElement => {
  const amount = getTxAmount(tx, false)
  const { data, recipient } = getTxData(tx)
  return <CustomDescription {...{ amount, data, recipient }} storedTx={tx} />
}

const UpgradeDescriptionTx = ({ tx }: { tx: Transaction }): React.ReactElement => {
  const { data } = getTxData(tx)
  return <div>{data}</div>
}

const TransferDescriptionTx = ({ tx }: { tx: Transaction }): React.ReactElement => {
  const amountWithSymbol = getTxAmount(tx, false)
  const rawAmount = getRawTxAmount(tx)
  const { recipient, isTokenTransfer = false, tokenAddress } = getTxData(tx)
  return <TransferDescription {...{ amountWithSymbol, recipient, isTokenTransfer, rawAmount, tokenAddress }} />
}

const TxDescription = ({ tx }: { tx: Transaction }): React.ReactElement => {
  const classes = useStyles()

  return (
    <Block className={classes.txDataContainer}>
      {tx.type === TransactionTypes.SETTINGS && <SettingsDescriptionTx tx={tx} />}
      {tx.type === TransactionTypes.CUSTOM && <CustomDescriptionTx tx={tx} />}
      {tx.type === TransactionTypes.UPGRADE && <UpgradeDescriptionTx tx={tx} />}
      {[TransactionTypes.TOKEN, TransactionTypes.COLLECTIBLE, TransactionTypes.OUTGOING].includes(tx.type) && (
        <TransferDescriptionTx tx={tx} />
      )}
    </Block>
  )
}

export default TxDescription
