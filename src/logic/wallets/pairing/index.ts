import { StaticJsonRpcProvider } from '@ethersproject/providers'
import {
  Chain,
  ProviderAccounts,
  WalletInit,
  EIP1193Provider,
  ProviderRpcError,
  ProviderRpcErrorCode,
} from '@web3-onboard/common'
import type { IClientMeta } from '@walletconnect/types'
import WalletConnect from '@walletconnect/client'

import { APP_VERSION, PUBLIC_URL, WC_BRIDGE } from 'src/utils/constants'
import { getOnboardInstance } from 'src/logic/wallets/onboard'

export const PAIRING_MODULE_NAME = 'Safe Mobile'
export const PAIRING_STORAGE_ID = 'SAFE__pairingProvider'

const _pairingConnector = new WalletConnect({
  bridge: WC_BRIDGE,
  storageId: PAIRING_STORAGE_ID,
})

export const getPairingConnector = (): InstanceType<typeof WalletConnect> => {
  if (!_pairingConnector) {
    throw new Error('Pairing is not initialized')
  }
  return _pairingConnector
}

if (!_pairingConnector.connected) {
  _pairingConnector.createSession()
}

_pairingConnector.on('connect', () => {
  getOnboardInstance().connectWallet({
    autoSelect: { label: PAIRING_MODULE_NAME, disableModals: true },
  })
})

// Modified version of web3-onboard/walletconnect v2.0.1
export function pairingModule(): WalletInit {
  return ({ device: { browser, os } }) => {
    const connector = getPairingConnector()

    const app = `Safe Web v${APP_VERSION}`
    const logo = `${location.origin}${PUBLIC_URL}/resources/logo_120x120.png`

    const clientMeta: IClientMeta = {
      name: app,
      description: `${browser.name} ${browser.version} (${os.name});${app}`,
      url: 'https://gnosis-safe.io/app',
      icons: [logo],
    }

    ;(connector as any).clientMeta = clientMeta
    ;(connector as any)._clientMeta = clientMeta

    return {
      label: PAIRING_MODULE_NAME,
      getIcon:
        async () => `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M18 2.25H9C7.14487 2.25 5.625 3.76875 5.625 5.625V21.375C5.625 23.2313 7.14487 24.75 9 24.75H18C19.8562 24.75 21.375 23.2313 21.375 21.375V5.625C21.375 3.76875 19.8562 2.25 18 2.25ZM18 4.5C18.6098 4.5 19.125 5.01525 19.125 5.625V21.375C19.125 21.9848 18.6098 22.5 18 22.5H9C8.39025 22.5 7.875 21.9848 7.875 21.375V5.625C7.875 5.01525 8.39025 4.5 9 4.5H18Z" fill="#008C73"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 18.8511C12.7237 18.8511 12.0938 19.4811 12.0938 20.2573C12.0938 21.0336 12.7237 21.6636 13.5 21.6636C14.2762 21.6636 14.9062 21.0336 14.9062 20.2573C14.9062 19.4811 14.2762 18.8511 13.5 18.8511Z" fill="#008C73"/>
                    </svg>`,
      getInterface: async ({ chains, EventEmitter }) => {
        const { Subject, fromEvent } = await import('rxjs')
        const { takeUntil, take } = await import('rxjs/operators')

        const emitter = new EventEmitter()

        class EthProvider {
          public request: EIP1193Provider['request']
          public connector: InstanceType<typeof WalletConnect>
          public chains: Chain[]
          public disconnect: EIP1193Provider['disconnect']
          // @ts-expect-error type mismatch
          public emit: typeof EventEmitter['emit']
          // @ts-expect-error type mismatch
          public on: typeof EventEmitter['on']
          // @ts-expect-error type mismatch
          public removeListener: typeof EventEmitter['removeListener']

          private disconnected$: InstanceType<typeof Subject>
          private providers: Record<string, StaticJsonRpcProvider>

          constructor({ connector, chains }: { connector: InstanceType<typeof WalletConnect>; chains: Chain[] }) {
            this.emit = emitter.emit.bind(emitter)
            this.on = emitter.on.bind(emitter)
            this.removeListener = emitter.removeListener.bind(emitter)

            this.connector = connector
            this.chains = chains
            this.disconnected$ = new Subject()
            this.providers = {}

            // Listen for session updates
            fromEvent(this.connector, 'session_update', (error, payload) => {
              if (error) {
                throw error
              }

              return payload
            })
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: ({ params }) => {
                  const [{ accounts, chainId }] = params
                  this.emit('accountsChanged', accounts)
                  this.emit('chainChanged', `0x${chainId.toString(16)}`)
                },
                error: console.warn,
              })

            const onDisconnect = () => this.connector.killSession()

            window.addEventListener('unload', onDisconnect, { once: true })

            // Listen for disconnect event
            fromEvent(this.connector, 'disconnect', (error, payload) => {
              if (error) {
                throw error
              }

              return payload
            })
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: () => {
                  this.emit('accountsChanged', [])
                  this.disconnected$.next(true)
                  localStorage.removeItem(PAIRING_STORAGE_ID)
                },
                error: console.warn,
              })

            this.disconnect = () => onDisconnect()

            this.request = async ({ method, params }) => {
              if (method === 'eth_chainId') {
                return `0x${this.connector.chainId.toString(16)}`
              }

              if (method === 'eth_requestAccounts') {
                return new Promise<ProviderAccounts>((resolve, reject) => {
                  // Check if connection is already established
                  if (this.connector.connected) {
                    const { accounts, chainId } = this.connector.session
                    this.emit('chainChanged', `0x${chainId.toString(16)}`)
                    return resolve(accounts)
                  }

                  // Subscribe to connection events
                  fromEvent(this.connector, 'connect', (error, payload) => {
                    console.log('connect')
                    if (error) {
                      throw error
                    }

                    return payload
                  })
                    .pipe(take(1))
                    .subscribe({
                      next: ({ params }) => {
                        const [{ accounts, chainId }] = params
                        this.emit('accountsChanged', accounts)
                        this.emit('chainChanged', `0x${chainId.toString(16)}`)
                        resolve(accounts)
                      },
                      error: reject,
                    })
                })
              }

              if (['wallet_switchEthereumChain', 'eth_selectAccounts'].includes(method)) {
                throw new ProviderRpcError({
                  code: ProviderRpcErrorCode.UNSUPPORTED_METHOD,
                  message: `The Provider does not support the requested method: ${method}`,
                })
              }

              if (method === 'eth_sendTransaction') {
                return this.connector.sendTransaction(params[0])
              }

              if (method === 'eth_signTransaction') {
                return this.connector.signTransaction(params[0])
              }

              if (method === 'personal_sign') {
                return this.connector.signPersonalMessage(params)
              }

              if (method === 'eth_sign') {
                return this.connector.signMessage(params)
              }

              if (method === 'eth_signTypedData') {
                return this.connector.signTypedData(params)
              }

              if (method === 'eth_accounts') {
                return this.connector.sendCustomRequest({
                  id: 1337,
                  jsonrpc: '2.0',
                  method,
                  params,
                })
              }

              const chainId = await this.request({ method: 'eth_chainId' })

              if (!this.providers[chainId]) {
                const currentChain = chains.find(({ id }) => id === chainId)

                if (!currentChain) {
                  throw new ProviderRpcError({
                    code: ProviderRpcErrorCode.CHAIN_NOT_ADDED,
                    message: `The Provider does not have a rpcUrl to make a request for the requested method: ${method}`,
                  })
                }

                this.providers[chainId] = new StaticJsonRpcProvider(currentChain.rpcUrl)
              }

              return this.providers[chainId].send(method, params)
            }
          }
        }

        return {
          provider: new EthProvider({ chains, connector }),
        }
      },
    }
  }
}
