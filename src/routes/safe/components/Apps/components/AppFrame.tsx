import { ReactElement, useState, useRef, useCallback, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Loader, Card, Title } from '@gnosis.pm/safe-react-components'
import {
  GetBalanceParams,
  GetTxBySafeTxHashParams,
  MethodToResponse,
  RPCPayload,
  Methods,
  SignMessageParams,
  RequestId,
} from '@gnosis.pm/safe-apps-sdk'
import { useSelector } from 'react-redux'
import { INTERFACE_MESSAGES, Transaction, LowercaseNetworks } from '@gnosis.pm/safe-apps-sdk-v1'
import Web3 from 'web3'

import { currentSafe } from 'src/logic/safe/store/selectors'
import { getChainInfo, getSafeAppsRpcServiceUrl, getTxServiceUrl } from 'src/config'
import { isSameURL } from 'src/utils/url'
import { useAnalytics, SAFE_EVENTS } from 'src/utils/googleAnalytics'
import { LoadingContainer } from 'src/components/LoaderContainer/index'
import { SAFE_POLLING_INTERVAL } from 'src/utils/constants'
import { ConfirmTxModal } from './ConfirmTxModal'
import { useIframeMessageHandler } from '../hooks/useIframeMessageHandler'
import { getAppInfoFromUrl, getEmptySafeApp, getLegacyChainName } from '../utils'
import { SafeApp } from '../types'
import { useAppCommunicator } from '../communicator'
import { fetchTokenCurrenciesBalances } from 'src/logic/safe/api/fetchTokenCurrenciesBalances'
import { fetchSafeTransaction } from 'src/logic/safe/transactions/api/fetchSafeTransaction'
import { logError, Errors } from 'src/logic/exceptions/CodedException'
import { addressBookEntryName } from 'src/logic/addressBook/store/selectors'
import { useSignMessageModal } from '../hooks/useSignMessageModal'
import { SignMessageModal } from './SignMessageModal'
import { web3HttpProviderOptions } from 'src/logic/wallets/getWeb3'
import { useThirdPartyCookies } from '../hooks/useThirdPartyCookies'
import { ThirdPartyCookiesWarning } from './ThirdPartyCookiesWarning'
import { grantedSelector } from 'src/routes/safe/container/selector'

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 -16px;
`

const StyledCard = styled(Card)`
  flex-grow: 1;
  padding: 0;
  border-radius: 0;
`

const StyledIframe = styled.iframe<{ isLoading: boolean }>`
  height: 100%;
  width: 100%;
  overflow: auto;
  box-sizing: border-box;
  display: ${({ isLoading }) => (isLoading ? 'none' : 'block')};
`

export type TransactionParams = {
  safeTxGas?: number
}

type ConfirmTransactionModalState = {
  isOpen: boolean
  txs: Transaction[]
  requestId: RequestId
  params?: TransactionParams
}

type Props = {
  appUrl: string
}

const APP_LOAD_ERROR_TIMEOUT = 30000

const INITIAL_CONFIRM_TX_MODAL_STATE: ConfirmTransactionModalState = {
  isOpen: false,
  txs: [],
  requestId: '',
  params: undefined,
}

const URL_NOT_PROVIDED_ERROR = 'App url No provided or it is invalid.'
const APP_LOAD_ERROR = 'There was an error loading the Safe App. There might be a problem with the App provider.'

const AppFrame = ({ appUrl }: Props): ReactElement => {
  const { address: safeAddress, ethBalance, owners, threshold } = useSelector(currentSafe)
  const { nativeCurrency, chainId, chainName, shortName } = getChainInfo()
  const safeName = useSelector((state) => addressBookEntryName(state, { address: safeAddress }))
  const granted = useSelector(grantedSelector)
  const { trackEvent } = useAnalytics()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [confirmTransactionModal, setConfirmTransactionModal] =
    useState<ConfirmTransactionModalState>(INITIAL_CONFIRM_TX_MODAL_STATE)
  const [appIsLoading, setAppIsLoading] = useState<boolean>(true)
  const [safeApp, setSafeApp] = useState<SafeApp>(() => getEmptySafeApp(appUrl))
  const [signMessageModalState, openSignMessageModal, closeSignMessageModal] = useSignMessageModal()
  const timer = useRef<number>()
  const [isLoadingSlow, setIsLoadingSlow] = useState<boolean>(false)
  const errorTimer = useRef<number>()
  const [, setAppLoadError] = useState<boolean>(false)
  const { thirdPartyCookiesDisabled, setThirdPartyCookiesDisabled } = useThirdPartyCookies()

  const safeAppsRpc = getSafeAppsRpcServiceUrl()
  const safeAppWeb3Provider = useMemo(
    () => new Web3.providers.HttpProvider(safeAppsRpc, web3HttpProviderOptions),
    [safeAppsRpc],
  )

  useEffect(() => {
    const clearTimeouts = () => {
      clearTimeout(timer.current)
      clearTimeout(errorTimer.current)
    }

    if (appIsLoading) {
      timer.current = window.setTimeout(() => {
        setIsLoadingSlow(true)
      }, SAFE_POLLING_INTERVAL)
      errorTimer.current = window.setTimeout(() => {
        setAppLoadError(() => {
          throw Error(APP_LOAD_ERROR)
        })
      }, APP_LOAD_ERROR_TIMEOUT)
    } else {
      clearTimeouts()
      setIsLoadingSlow(false)
    }

    return () => {
      clearTimeouts()
    }
  }, [appIsLoading])

  const openConfirmationModal = useCallback(
    (txs: Transaction[], params: TransactionParams | undefined, requestId: RequestId) =>
      setConfirmTransactionModal({
        isOpen: true,
        txs,
        requestId,
        params,
      }),
    [setConfirmTransactionModal],
  )
  const closeConfirmationModal = useCallback(
    () => setConfirmTransactionModal(INITIAL_CONFIRM_TX_MODAL_STATE),
    [setConfirmTransactionModal],
  )

  const { sendMessageToIframe } = useIframeMessageHandler(
    safeApp,
    openConfirmationModal,
    closeConfirmationModal,
    iframeRef,
  )

  const onIframeLoad = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe || !isSameURL(iframe.src, appUrl as string)) {
      return
    }

    setAppIsLoading(false)
    sendMessageToIframe({
      messageId: INTERFACE_MESSAGES.ON_SAFE_INFO,
      data: {
        safeAddress: safeAddress as string,
        // FIXME `network` is deprecated. we should find how many apps are still using it
        network: getLegacyChainName(chainName, chainId).toLowerCase() as LowercaseNetworks,
        ethBalance: ethBalance as string,
      },
    })
  }, [chainName, chainId, ethBalance, safeAddress, appUrl, sendMessageToIframe])

  const communicator = useAppCommunicator(iframeRef, safeApp)

  useEffect(() => {
    /**
     * @deprecated: getEnvInfo is a legacy method. Should not be used
     */
    communicator?.on('getEnvInfo', () => ({
      txServiceUrl: getTxServiceUrl(),
    }))

    communicator?.on(Methods.getTxBySafeTxHash, async (msg) => {
      const { safeTxHash } = msg.data.params as GetTxBySafeTxHashParams

      const tx = await fetchSafeTransaction(safeTxHash)

      return tx
    })

    communicator?.on(Methods.getEnvironmentInfo, async () => ({
      origin: document.location.origin,
    }))

    communicator?.on(Methods.getSafeInfo, () => ({
      safeAddress,
      // FIXME `network` is deprecated. we should find how many apps are still using it
      // Apps using this property expect this to be in UPPERCASE
      network: getLegacyChainName(chainName, chainId).toUpperCase(),
      chainId: parseInt(chainId, 10),
      owners,
      threshold,
      isReadOnly: !granted,
    }))

    communicator?.on(Methods.getSafeBalances, async (msg) => {
      const { currency = 'usd' } = msg.data.params as GetBalanceParams

      const balances = await fetchTokenCurrenciesBalances({ safeAddress, selectedCurrency: currency })

      return balances
    })

    communicator?.on(Methods.rpcCall, async (msg) => {
      const params = msg.data.params as RPCPayload

      try {
        const response = new Promise<MethodToResponse['rpcCall']>((resolve, reject) => {
          safeAppWeb3Provider.send(
            {
              jsonrpc: '2.0',
              method: params.call,
              params: params.params,
              id: '1',
            },
            (err, res) => {
              if (err || res?.error) {
                reject(err || res?.error)
              }

              resolve(res?.result)
            },
          )
        })

        return response
      } catch (err) {
        return err
      }
    })

    communicator?.on(Methods.sendTransactions, (msg) => {
      // @ts-expect-error explore ways to fix this
      openConfirmationModal(msg.data.params.txs as Transaction[], msg.data.params.params, msg.data.id)
    })

    communicator?.on(Methods.signMessage, async (msg) => {
      const { message } = msg.data.params as SignMessageParams

      openSignMessageModal(message, msg.data.id)
    })

    communicator?.on(Methods.getChainInfo, async () => {
      return {
        chainName,
        chainId,
        shortName,
        nativeCurrency,
      }
    })
  }, [
    communicator,
    openConfirmationModal,
    safeAddress,
    owners,
    threshold,
    openSignMessageModal,
    nativeCurrency,
    chainId,
    chainName,
    shortName,
    safeAppWeb3Provider,
    granted,
  ])

  const onUserTxConfirm = (safeTxHash: string, requestId: RequestId) => {
    // Safe Apps SDK V1 Handler
    sendMessageToIframe(
      { messageId: INTERFACE_MESSAGES.TRANSACTION_CONFIRMED, data: { safeTxHash } },
      confirmTransactionModal.requestId,
    )

    // Safe Apps SDK V2 Handler
    communicator?.send({ safeTxHash }, requestId as string)
  }

  const onTxReject = (requestId: RequestId) => {
    // Safe Apps SDK V1 Handler
    sendMessageToIframe(
      { messageId: INTERFACE_MESSAGES.TRANSACTION_REJECTED, data: {} },
      confirmTransactionModal.requestId,
    )

    // Safe Apps SDK V2 Handler
    communicator?.send('Transaction was rejected', requestId as string, true)
  }

  useEffect(() => {
    if (!appUrl) {
      throw Error(URL_NOT_PROVIDED_ERROR)
    }

    const loadApp = async () => {
      try {
        const app = await getAppInfoFromUrl(appUrl, false)
        setSafeApp(app)
      } catch (err) {
        logError(Errors._900, `${appUrl}, ${err.message}`)
      }
    }

    loadApp()
  }, [appUrl])

  //track GA
  useEffect(() => {
    if (safeApp) {
      trackEvent({ ...SAFE_EVENTS.SAFE_APP, label: safeApp.name })
    }
  }, [safeApp, trackEvent])

  return (
    <AppWrapper>
      {thirdPartyCookiesDisabled && <ThirdPartyCookiesWarning onClose={() => setThirdPartyCookiesDisabled(false)} />}
      <StyledCard>
        {appIsLoading && (
          <LoadingContainer style={{ flexDirection: 'column' }}>
            {isLoadingSlow && <Title size="xs">The Safe App is taking too long to load, consider refreshing.</Title>}
            <Loader size="md" />
          </LoadingContainer>
        )}

        <StyledIframe
          isLoading={appIsLoading}
          frameBorder="0"
          id={`iframe-${appUrl}`}
          ref={iframeRef}
          src={appUrl}
          title={safeApp.name}
          onLoad={onIframeLoad}
          allow="camera"
        />
      </StyledCard>

      <ConfirmTxModal
        isOpen={confirmTransactionModal.isOpen}
        app={safeApp as SafeApp}
        safeAddress={safeAddress}
        ethBalance={ethBalance as string}
        safeName={safeName as string}
        txs={confirmTransactionModal.txs}
        onClose={closeConfirmationModal}
        requestId={confirmTransactionModal.requestId}
        onUserConfirm={onUserTxConfirm}
        params={confirmTransactionModal.params}
        onTxReject={onTxReject}
      />

      <SignMessageModal
        isOpen={signMessageModalState.isOpen}
        app={safeApp as SafeApp}
        safeAddress={safeAddress}
        ethBalance={ethBalance as string}
        safeName={safeName as string}
        onClose={closeSignMessageModal}
        requestId={signMessageModalState.requestId}
        message={signMessageModalState.message}
        onUserConfirm={onUserTxConfirm}
        onTxReject={onTxReject}
      />
    </AppWrapper>
  )
}

export default AppFrame
