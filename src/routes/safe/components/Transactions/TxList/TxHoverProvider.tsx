import { createContext, ReactElement, ReactNode, useState } from 'react'

export const TxHoverContext = createContext<{
  activeHover?: string
  setActiveHover: (activeHover?: string) => void
  pendingTx?: string
  setPendingTx: (hasPendingTx?: string) => void
}>({
  activeHover: undefined,
  setActiveHover: () => {},
  pendingTx: undefined,
  setPendingTx: () => {},
})

export const TxHoverProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [activeHover, setActiveHover] = useState<string | undefined>()
  const [pendingTx, setPendingTx] = useState<string | undefined>()

  return (
    <TxHoverContext.Provider value={{ activeHover, setActiveHover, pendingTx, setPendingTx }}>
      {children}
    </TxHoverContext.Provider>
  )
}
