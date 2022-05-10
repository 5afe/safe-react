import { createContext, ReactElement, ReactNode, useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

import { fetchTransactionDetails } from 'src/logic/safe/store/actions/fetchTransactionDetails'

export type ActionType = 'cancel' | 'confirm' | 'execute' | 'none'

export type SelectedAction = {
  selectedAction: {
    actionSelected: ActionType
    transactionId: string
  }
  selectAction: (args: SelectedAction['selectedAction']) => void
}

export const TransactionActionStateContext = createContext<SelectedAction>({
  selectedAction: {
    actionSelected: 'none',
    transactionId: '',
  },
  selectAction: () => {},
})

export const TxActionProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const dispatch = useRef(useDispatch())
  const [selectedAction, setSelectedAction] = useState<SelectedAction['selectedAction']>({
    actionSelected: 'none',
    transactionId: '',
  })

  const selectAction = useCallback(({ actionSelected, transactionId }: SelectedAction['selectedAction']) => {
    if (transactionId) {
      dispatch.current(fetchTransactionDetails({ transactionId }))
    }

    setSelectedAction({ actionSelected, transactionId })
  }, [])

  return (
    <TransactionActionStateContext.Provider value={{ selectedAction, selectAction }}>
      {children}
    </TransactionActionStateContext.Provider>
  )
}
