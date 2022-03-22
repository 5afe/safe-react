import { ReactElement, useContext } from 'react'
import { useSelector } from 'react-redux'

import { ExpandedTxDetails, Transaction } from 'src/logic/safe/store/models/types/gateway.d'
import { getTransactionByAttribute } from 'src/logic/safe/store/selectors/gatewayTransactions'
import { AppReduxState } from 'src/store'
import { ApproveTxModal } from './modals/ApproveTxModal'
import { RejectTxModal } from './modals/RejectTxModal'
import { TransactionActionStateContext } from './TxActionProvider'
import { Overwrite } from 'src/types/helpers'

export const ActionModal = (): ReactElement | null => {
  const { selectedAction, selectAction } = useContext(TransactionActionStateContext)

  const transaction = useSelector((state: AppReduxState) =>
    getTransactionByAttribute(state, {
      attributeValue: selectedAction.transactionId,
      attributeName: 'id',
    }),
  )

  const onClose = () => selectAction({ actionSelected: 'none', transactionId: '' })

  if (!transaction?.txDetails || selectedAction.actionSelected === 'none') {
    return null
  }

  const Modal = selectedAction.actionSelected === 'cancel' ? RejectTxModal : ApproveTxModal

  return (
    <Modal
      isOpen
      onClose={onClose}
      transaction={transaction as Overwrite<Transaction, { txDetails: ExpandedTxDetails }>}
    />
  )
}
