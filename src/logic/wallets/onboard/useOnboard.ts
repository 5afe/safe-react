import { useCallback, useEffect, useState } from 'react'
import { numberToHex } from 'web3-utils'
import type { OnboardAPI } from '@web3-onboard/core'
import type { AppState, ConnectOptions } from '@web3-onboard/core/dist/types.d'

import { _getOnboardState, getOnboardState, getOnboardInstance } from 'src/logic/wallets/onboard/index'
import type { ChainId } from 'src/config/chain.d'

type Connect = (autoSelect?: ConnectOptions['autoSelect']) => ReturnType<OnboardAPI['connectWallet']>
type Disconnect = () => ReturnType<OnboardAPI['disconnectWallet']>
type SetChain = (chainId: ChainId) => ReturnType<OnboardAPI['setChain']>

export const useOnboard = (): {
  connect: Connect
  disconnect: Disconnect
  setChain: SetChain
} & ReturnType<typeof getOnboardState> => {
  const [onboardState, setOnboardState] = useState<AppState>(_getOnboardState())
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
    return await getOnboardInstance().connectWallet(autoSelect ? { autoSelect } : undefined)
  }, [])

  const disconnect = useCallback<Disconnect>(async () => {
    return await getOnboardInstance().disconnectWallet({
      label: providerState.wallet.label,
    })
  }, [providerState.wallet.label])

  const setChain = useCallback<SetChain>(async (chainId) => {
    return await getOnboardInstance().setChain({
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
