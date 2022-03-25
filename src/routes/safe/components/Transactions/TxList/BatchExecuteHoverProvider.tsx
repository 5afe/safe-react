import { createContext, ReactElement, ReactNode, useState } from 'react'

export const BatchExecuteHoverContext = createContext<{
  activeHover?: string[]
  setActiveHover: (activeHover?: string[]) => void
}>({
  activeHover: undefined,
  setActiveHover: () => {},
})

export const BatchExecuteHoverProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [activeHover, setActiveHover] = useState<string[]>()

  return (
    <BatchExecuteHoverContext.Provider value={{ activeHover, setActiveHover }}>
      {children}
    </BatchExecuteHoverContext.Provider>
  )
}
