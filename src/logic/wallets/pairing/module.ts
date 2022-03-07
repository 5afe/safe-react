import { Chain, EIP1193Provider, ProviderAccounts, WalletInit } from '@web3-onboard/common'
import { ProviderRpcError } from '@web3-onboard/common'
import { IClientMeta } from '@walletconnect/types'
import WalletConnect from '@walletconnect/client'

import { APP_VERSION, PUBLIC_URL } from 'src/utils/constants'
import { WC_BRIDGE } from 'src/logic/wallets/onboard/wallets'

export const PAIRING_MODULE_NAME = 'Safe Mobile'

function pairingModule(): WalletInit {
  return ({ device: { browser, os } }) => {
    const STORAGE_ID = 'SAFE__pairingProvider'

    const app = `Safe Web v${APP_VERSION}`
    const logo = `${location.origin}${PUBLIC_URL}/resources/logo_120x120.png`

    const clientMeta: IClientMeta = {
      name: app,
      description: `${browser.name} ${browser.version} (${os.name});${app}`,
      url: 'https://gnosis-safe.io/app',
      icons: [logo],
    }

    const connector = new WalletConnect({
      bridge: WC_BRIDGE,
      storageId: STORAGE_ID,
      clientMeta,
    })

    // WalletConnect overrides the clientMeta, so we need to set it back
    ;(connector as any)._clientMeta = clientMeta

    connector.createSession()

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
          // @ts-expect-error web3-onboard does not include this
          public emit: typeof EventEmitter['emit']
          // @ts-expect-error web3-onboard does not include this
          public on: typeof EventEmitter['on']
          // @ts-expect-error web3-onboard does not include this
          public removeListener: typeof EventEmitter['removeListener']

          private disconnected$: InstanceType<typeof Subject>

          constructor({ connector, chains }: { connector: InstanceType<typeof WalletConnect>; chains: Chain[] }) {
            this.emit = emitter.emit.bind(emitter)
            this.on = emitter.on.bind(emitter)
            this.removeListener = emitter.removeListener.bind(emitter)

            this.connector = connector
            this.chains = chains
            this.disconnected$ = new Subject()

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

            // Disconnect on unmount
            fromEvent(window, 'unload')
              .pipe(takeUntil(this.disconnected$))
              .subscribe({
                next: () => this.emit('disconnect'),
                error: console.warn,
              })

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
                  localStorage.removeItem(STORAGE_ID)
                },
                error: console.warn,
              })

            this.disconnect = () => this.connector.killSession()

            this.request = ({ method, params }) => {
              if (method === 'eth_chainId') {
                return Promise.resolve(`0x${this.connector.chainId.toString(16)}`)
              }

              if (method === 'eth_requestAccounts') {
                return new Promise<ProviderAccounts>((resolve, reject) => {
                  if (this.connector.connected) {
                    const { accounts, chainId } = this.connector.session
                    this.emit('chainChanged', `0x${chainId.toString(16)}`)
                    return resolve(accounts)
                  }

                  // Subscribe to connection events
                  fromEvent(this.connector, 'connect', (error, payload) => {
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
                  code: 4200,
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

              return this.connector.sendCustomRequest({
                id: 1337,
                jsonrpc: '2.0',
                method,
                params,
              })
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

export default pairingModule
