import React, { createContext, ReactElement, ReactNode, useState } from 'react'
import { TxLocation } from 'src/logic/safe/store/models/types/gateway'

export type TxLocationProps = {
  txLocation: TxLocation
  setTxLocation?: (txLocation: TxLocation) => void
}

export const TxLocationContext = createContext<TxLocationProps>({
  txLocation: 'history',
  setTxLocation: () => {},
})

export const TxLocationProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [txLocation, setTxLocation] = useState<TxLocation>('history')

  return <TxLocationContext.Provider value={{ txLocation, setTxLocation }}>{children}</TxLocationContext.Provider>
}
