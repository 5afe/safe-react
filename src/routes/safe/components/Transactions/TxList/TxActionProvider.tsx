import { createContext, ReactElement, ReactNode, useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { fetchTransactionDetails } from 'src/logic/safe/store/actions/fetchTransactionDetails'
import { TxLocation } from 'src/logic/safe/store/models/types/gateway.d'

export type ActionType = 'cancel' | 'confirm' | 'execute' | 'none'

export type SelectedAction = {
  // FixMe: give proper names to the keys
  //  for instance:
  //  `action->{ type; forTransactionId; txLocation; }`
  //  `setAction` as callback
  selectedAction: {
    actionSelected: ActionType
    transactionId: string
    txLocation: TxLocation
  }
  selectAction: (args: SelectedAction['selectedAction']) => Promise<void>
}

export const TransactionActionStateContext = createContext<SelectedAction>({
  selectedAction: {
    actionSelected: 'none',
    transactionId: '',
    txLocation: 'history',
  },
  selectAction: () => Promise.resolve(),
})

export const TxActionProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const dispatch = useRef(useDispatch())
  const [selectedAction, setSelectedAction] = useState<SelectedAction['selectedAction']>({
    actionSelected: 'none',
    transactionId: '',
    txLocation: 'history',
  })

  const selectAction = useCallback(
    async ({ actionSelected, transactionId, txLocation }: SelectedAction['selectedAction']) => {
      if (transactionId) {
        await dispatch.current(fetchTransactionDetails({ transactionId, txLocation }))
      }

      setSelectedAction({ actionSelected, transactionId, txLocation })
    },
    [],
  )

  return (
    <TransactionActionStateContext.Provider value={{ selectedAction, selectAction }}>
      {children}
    </TransactionActionStateContext.Provider>
  )
}
