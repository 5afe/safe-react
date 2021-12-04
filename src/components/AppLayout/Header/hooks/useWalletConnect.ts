import { useEffect, useState } from 'react'
import WalletConnect from '@walletconnect/client'
import { ChainId } from 'src/config/chain'

type WalletConnectState = {
  uri: string
  chainId: ChainId
  address: string
}

// Cache connector as dropdown is opened often
const connector = new WalletConnect({
  bridge: 'https://bridge.walletconnect.org',
})

const useWalletConnect = (): WalletConnectState => {
  const [state, setState] = useState<WalletConnectState>({
    uri: '',
    chainId: '',
    address: '',
  })

  useEffect(() => {
    const connect = async () => {
      if (!connector.connected) {
        await connector.createSession()

        const uri = connector.uri
        console.log('uri', uri)
        setState((prevState) => ({ ...prevState, uri }))
      }

      connector.on('connect', (error, payload) => {
        if (error) {
          throw error
        }

        console.log('payload', payload)
        const { chainId, accounts } = payload.params[0]

        setState((prevState) => ({
          ...prevState,
          chainId: chainId.toString(),
          address: accounts[0],
        }))
      })
    }
    connect()
  }, [])

  return state
}

export default useWalletConnect
