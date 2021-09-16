import { createContext, ReactElement, ReactNode, useState } from 'react'

export const TxHoverContext = createContext<{
  activeHover?: string
  setActiveHover: (activeHover?: string) => void
}>({
  activeHover: undefined,
  setActiveHover: () => {},
})

export const TxHoverProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [activeHover, setActiveHover] = useState<string | undefined>()

  return <TxHoverContext.Provider value={{ activeHover, setActiveHover }}>{children}</TxHoverContext.Provider>
}
