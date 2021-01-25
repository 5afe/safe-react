import React, { ReactElement, useContext } from 'react'
import { useSelector } from 'react-redux'

import { ExpandedTxDetails, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { getTransactionById } from 'src/logic/safe/store/selectors/getTransactionDetails'
import { ApproveTxModal } from 'src/routes/safe/components/GatewayTransactions/modals/ApproveTxModal'
import { RejectTxModal } from 'src/routes/safe/components/GatewayTransactions/modals/RejectTxModal'
import { TransactionActionStateContext } from 'src/routes/safe/components/GatewayTransactions/TxActionProvider'
import { Overwrite } from 'src/types/helpers'

export const ActionModal = (): ReactElement | null => {
  const { selectedAction, selectAction } = useContext(TransactionActionStateContext)

  const transaction = useSelector((state) =>
    getTransactionById(state, selectedAction.transactionId, selectedAction.txLocation),
  )

  const onClose = () => selectAction({ actionSelected: 'none', transactionId: '', txLocation: 'history' })

  if (!transaction) {
    return null
  }

  switch (selectedAction.actionSelected) {
    case 'cancel':
      return <RejectTxModal isOpen onClose={onClose} gwTransaction={transaction} />

    case 'confirm':
      return (
        <ApproveTxModal
          isOpen
          onClose={onClose}
          gwTransaction={transaction as Overwrite<Transaction, { txDetails: ExpandedTxDetails }>}
        />
      )

    case 'execute':
      return (
        <ApproveTxModal
          canExecute
          isOpen
          onClose={onClose}
          gwTransaction={transaction as Overwrite<Transaction, { txDetails: ExpandedTxDetails }>}
        />
      )

    case 'none':
      return null
  }
}
