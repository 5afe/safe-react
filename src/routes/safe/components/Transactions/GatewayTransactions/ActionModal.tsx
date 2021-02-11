import React, { ReactElement, useContext } from 'react'
import { useSelector } from 'react-redux'

import { ExpandedTxDetails, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { getTransactionByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { useTransactionParameters } from 'src/routes/safe/container/hooks/useTransactionParameters'
import { AppReduxState } from 'src/store'
import { ApproveTxModal } from './modals/ApproveTxModal'
import { RejectTxModal } from './modals/RejectTxModal'
import { TransactionActionStateContext } from './TxActionProvider'
import { Overwrite } from 'src/types/helpers'

export const ActionModal = (): ReactElement | null => {
  const { selectedAction, selectAction } = useContext(TransactionActionStateContext)
  const txParameters = useTransactionParameters()

  const transaction = useSelector((state: AppReduxState) =>
    getTransactionByAttribute(state)({
      attributeValue: selectedAction.transactionId,
      attributeName: 'id',
      txLocation: selectedAction.txLocation,
    }),
  )

  const onClose = () => selectAction({ actionSelected: 'none', transactionId: '', txLocation: 'history' })

  if (!transaction?.txDetails) {
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
          transaction={transaction as Overwrite<Transaction, { txDetails: ExpandedTxDetails }>}
          txParameters={txParameters}
        />
      )

    case 'execute':
      return (
        <ApproveTxModal
          canExecute
          isOpen
          onClose={onClose}
          transaction={transaction as Overwrite<Transaction, { txDetails: ExpandedTxDetails }>}
          txParameters={txParameters}
        />
      )

    case 'none':
      return null
  }
}
