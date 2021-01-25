import React, { createContext, ReactElement, ReactNode, useState } from 'react'
import { TxLocation } from 'src/logic/safe/store/models/types/gateway'

export const TxLocationContext = createContext<{
  txLocation: TxLocation
  setTxLocation?: (txLocation: TxLocation) => void
}>({
  txLocation: 'history',
  setTxLocation: () => {},
})

export const TxLocationProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [txLocation, setTxLocation] = useState<TxLocation>('history')

  return <TxLocationContext.Provider value={{ txLocation, setTxLocation }}>{children}</TxLocationContext.Provider>
}
