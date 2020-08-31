import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

import { styles } from './styles'
import { getTxData } from './utils'
import SettingsDescription from './SettingsDescription'
import CustomDescription from './CustomDescription'
import TransferDescription from './TransferDescription'

import { getTxAmount } from 'src/routes/safe/components/Transactions/TxsTable/columns'
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
  }: any = getTxData(tx)
  const amount = getTxAmount(tx, false)
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
      {!upgradeTx && customTx && <CustomDescription amount={amount} data={data} recipient={recipient} storedTx={tx} />}
      {upgradeTx && <div>{data}</div>}
      {!cancellationTx && !modifySettingsTx && !customTx && !creationTx && !upgradeTx && (
        <TransferDescription amount={amount} recipient={recipient} />
      )}
    </Block>
  )
}

export default TxDescription
