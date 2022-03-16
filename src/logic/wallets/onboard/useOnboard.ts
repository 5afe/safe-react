import { useCallback, useEffect, useState } from 'react'
import { numberToHex } from 'web3-utils'
import type { AppState, ConnectOptions } from '@web3-onboard/core/dist/types.d'

import { getOnboardState, getOnboardInstance } from 'src/logic/wallets/onboard/index'
import type { ChainId } from 'src/config/chain.d'

type Connect = (autoSelect?: ConnectOptions['autoSelect']) => Promise<void>
type Disconnect = () => Promise<void>
type SetChain = (chainId: ChainId) => Promise<void>

export const useOnboard = (): {
  connect: Connect
  disconnect: Disconnect
  setChain: SetChain
} & ReturnType<typeof getOnboardState> => {
  const [onboardState, setOnboardState] = useState<AppState>()
  const providerState = getOnboardState(onboardState)

  useEffect(() => {
    const subscription = getOnboardInstance()
      .state.select()
      .subscribe((state) => {
        setOnboardState(state)
      })

    return subscription.unsubscribe.bind(subscription)
  }, [])

  const connect = useCallback<Connect>(async (autoSelect) => {
    // web3-onboard allows multiple wallets to be connected at once
    if (providerState.wallet.label) {
      throw new Error('Wallet is already connected.')
    }
    await getOnboardInstance().connectWallet(autoSelect ? { autoSelect } : undefined)
  }, [])

  const disconnect = useCallback<Disconnect>(async () => {
    await getOnboardInstance().disconnectWallet({
      label: providerState.wallet.label,
    })
  }, [providerState.wallet.label])

  const setChain = useCallback<SetChain>(async (chainId) => {
    await getOnboardInstance().setChain({
      chainId: numberToHex(chainId),
    })
  }, [])

  return {
    connect,
    disconnect,
    setChain,
    ...providerState,
  }
}
