import axios, { AxiosResponse } from 'axios'
import React, { createContext, ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getSafeServiceBaseUrl } from 'src/config'
import { TxServiceModel } from 'src/logic/safe/store/actions/transactions/fetchTransactions/loadOutgoingTransactions'
import { Transaction } from 'src/logic/safe/store/models/types/gateway'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'

import { ScrollableTransactionsContainer } from 'src/routes/safe/components/GatewayTransactions/styled'
import { ApproveTxModal } from './modals/ApproveTxModal'
import { RejectTxModal } from './modals/RejectTxModal'
import { useQueueTransactions } from './hooks/useQueueTransactions'
import { QueueTxList } from './QueueTxList'

type Action = 'cancel' | 'confirm' | 'execute' | 'none'
type SelectAction = { action: Action; transaction?: Transaction }

type ActionContext = {
  selectedAction: Action
  selectAction?: ({ action, transaction }: SelectAction) => void
}

export const TxActions = createContext<ActionContext>({ selectedAction: 'none' })

export const QueueTransactions = (): ReactElement => {
  const { next, queue } = useQueueTransactions()
  const totalTransactions = next.count + queue.count
  const [selectedAction, setSelectedAction] = useState<SelectAction>({ action: 'none' })

  const selectAction: ActionContext['selectAction'] = ({ action, transaction }) => {
    setSelectedAction({ action, transaction })
  }

  const ActionModal = (): ReactElement | null => {
    const safeAddress = useSelector(safeParamAddressFromStateSelector)
    const onClose = () => selectAction({ action: 'none' })

    const [transaction, setTransaction] = useState<TxServiceModel>()
    useEffect(() => {
      const retrieveTxInfo = async (safeTxHash: string) => {
        // <ExpandedTxDetails, AxiosResponse<ExpandedTxDetails>>
        const response = await axios
          .get<TxServiceModel, AxiosResponse<{ results: TxServiceModel[] }>>(
            `${getSafeServiceBaseUrl(safeAddress)}/transactions/?safe_tx_hash=${safeTxHash}`,
          )
          .catch(console.error)

        setTransaction(response ? response.data.results[0] : undefined)
      }

      if (selectedAction.transaction) {
        const match = selectedAction.transaction.id.match(/^multisig_0x[a-fA-F0-9]+_(0x[a-fA-F0-9]+)$/)

        if (!match) {
          return
        }

        const [, safeTxHash] = match

        retrieveTxInfo(safeTxHash)
      }
    }, [safeAddress])

    if (!transaction) {
      return null
    }

    switch (selectedAction.action) {
      case 'cancel':
        return <RejectTxModal isOpen onClose={onClose} transaction={transaction} />

      case 'confirm':
        return <ApproveTxModal isOpen onClose={onClose} transaction={transaction} />

      case 'execute':
        return <ApproveTxModal canExecute isOpen onClose={onClose} thresholdReached transaction={transaction} />

      case 'none':
        return null
    }
  }

  return totalTransactions === 0 ? (
    <div>No txs</div>
  ) : (
    <TxActions.Provider value={{ selectedAction: 'none', selectAction }}>
      <ScrollableTransactionsContainer>
        {next.count !== 0 && <QueueTxList txLocation="queued.next" transactions={next.transactions} />}
        {queue.count !== 0 && <QueueTxList txLocation="queued.queued" transactions={queue.transactions} />}
      </ScrollableTransactionsContainer>
      <ActionModal />
    </TxActions.Provider>
  )
}
