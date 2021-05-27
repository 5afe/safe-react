import React, { ReactElement, useState, useRef, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { FixedIcon, Loader, Title, Card } from '@gnosis.pm/safe-react-components'
import { GetBalanceParams, MethodToResponse, RPCPayload } from '@gnosis.pm/safe-apps-sdk'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { INTERFACE_MESSAGES, Transaction, RequestId, LowercaseNetworks } from '@gnosis.pm/safe-apps-sdk-v1'

import {
  safeEthBalanceSelector,
  safeParamAddressFromStateSelector,
  safeNameSelector,
} from 'src/logic/safe/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { getNetworkId, getNetworkName, getTxServiceUrl } from 'src/config'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { isSameURL } from 'src/utils/url'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'
import { useAppList } from '../hooks/useAppList'
import { LoadingContainer } from 'src/components/LoaderContainer/index'
import { TIMEOUT } from 'src/utils/constants'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'

import { ConfirmTxModal } from '../components/ConfirmTxModal'
import { useIframeMessageHandler } from '../hooks/useIframeMessageHandler'
import { useLegalConsent } from '../hooks/useLegalConsent'
import LegalDisclaimer from './LegalDisclaimer'
import { getAppInfoFromUrl } from '../utils'
import { SafeApp } from '../types'
import { useAppCommunicator } from '../communicator'
import { fetchTokenCurrenciesBalances } from 'src/logic/safe/api/fetchTokenCurrenciesBalances'

const OwnerDisclaimer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 476px;
`

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% + 59px);
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

const NETWORK_NAME = getNetworkName()
const NETWORK_ID = getNetworkId()

const INITIAL_CONFIRM_TX_MODAL_STATE: ConfirmTransactionModalState = {
  isOpen: false,
  txs: [],
  requestId: '',
  params: undefined,
}

const AppFrame = ({ appUrl }: Props): ReactElement => {
  const granted = useSelector(grantedSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const ethBalance = useSelector(safeEthBalanceSelector)
  const safeName = useSelector(safeNameSelector)
  const { trackEvent } = useAnalytics()
  const history = useHistory()
  const { consentReceived, onConsentReceipt } = useLegalConsent()
  const { staticAppsList } = useAppList()

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [confirmTransactionModal, setConfirmTransactionModal] = useState<ConfirmTransactionModalState>(
    INITIAL_CONFIRM_TX_MODAL_STATE,
  )
  const [appIsLoading, setAppIsLoading] = useState<boolean>(true)
  const [safeApp, setSafeApp] = useState<SafeApp | undefined>()

  const redirectToBalance = () => history.push(`${SAFELIST_ADDRESS}/${safeAddress}/balances`)
  const timer = useRef<number>()
  const [appTimeout, setAppTimeout] = useState(false)

  useEffect(() => {
    if (appIsLoading) {
      timer.current = window.setTimeout(() => {
        setAppTimeout(true)
      }, TIMEOUT)
    } else {
      clearTimeout(timer.current)
      setAppTimeout(false)
    }

    return () => {
      clearTimeout(timer.current)
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
  const closeConfirmationModal = useCallback(() => setConfirmTransactionModal(INITIAL_CONFIRM_TX_MODAL_STATE), [
    setConfirmTransactionModal,
  ])

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
        network: NETWORK_NAME.toLowerCase() as LowercaseNetworks,
        ethBalance: ethBalance as string,
      },
    })
  }, [ethBalance, safeAddress, appUrl, sendMessageToIframe])

  const communicator = useAppCommunicator(iframeRef, safeApp)

  useEffect(() => {
    communicator?.on('getEnvInfo', () => ({
      txServiceUrl: getTxServiceUrl(),
    }))

    communicator?.on('getSafeInfo', () => ({
      safeAddress,
      network: NETWORK_NAME,
      chainId: NETWORK_ID,
    }))

    communicator?.on('getSafeBalances', async (msg) => {
      const { currency = 'usd' } = msg.data.params as GetBalanceParams

      const balances = await fetchTokenCurrenciesBalances({ safeAddress, selectedCurrency: currency })

      return balances
    })

    communicator?.on('rpcCall', async (msg) => {
      const params = msg.data.params as RPCPayload

      try {
        const response = new Promise<MethodToResponse['rpcCall']>((resolve, reject) => {
          if (
            web3ReadOnly.currentProvider !== null &&
            typeof web3ReadOnly.currentProvider !== 'string' &&
            'send' in web3ReadOnly.currentProvider
          ) {
            web3ReadOnly.currentProvider?.send?.(
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
          }
        })

        return response
      } catch (err) {
        return err
      }
    })

    communicator?.on('sendTransactions', (msg) => {
      // @ts-expect-error explore ways to fix this
      openConfirmationModal(msg.data.params.txs as Transaction[], msg.data.params.params, msg.data.id)
    })
  }, [communicator, openConfirmationModal, safeAddress])

  const onUserTxConfirm = (safeTxHash: string) => {
    // Safe Apps SDK V1 Handler
    sendMessageToIframe(
      { messageId: INTERFACE_MESSAGES.TRANSACTION_CONFIRMED, data: { safeTxHash } },
      confirmTransactionModal.requestId,
    )

    // Safe Apps SDK V2 Handler
    communicator?.send({ safeTxHash }, confirmTransactionModal.requestId as string)
  }

  const onTxReject = () => {
    // Safe Apps SDK V1 Handler
    sendMessageToIframe(
      { messageId: INTERFACE_MESSAGES.TRANSACTION_REJECTED, data: {} },
      confirmTransactionModal.requestId,
    )

    // Safe Apps SDK V2 Handler
    communicator?.send('Transaction was rejected', confirmTransactionModal.requestId as string, true)
  }

  useEffect(() => {
    const loadApp = async () => {
      const app = await getAppInfoFromUrl(appUrl)

      setSafeApp(app)
    }
    if (staticAppsList.length) {
      loadApp()
    }
  }, [appUrl, staticAppsList])

  //track GA
  useEffect(() => {
    if (safeApp) {
      trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Apps', label: safeApp.name })
    }
  }, [safeApp, trackEvent])

  if (!appUrl) {
    throw Error('App url No provided or it is invalid.')
  }

  if (!safeApp) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  if (consentReceived === false) {
    return <LegalDisclaimer onCancel={redirectToBalance} onConfirm={onConsentReceipt} />
  }

  if (NETWORK_NAME === 'UNKNOWN' || !granted) {
    return (
      <OwnerDisclaimer>
        <FixedIcon type="notOwner" />
        <Title size="xs">To use apps, you must be an owner of this Safe</Title>
      </OwnerDisclaimer>
    )
  }

  return (
    <AppWrapper>
      <StyledCard>
        {appIsLoading && (
          <LoadingContainer style={{ flexDirection: 'column' }}>
            {appTimeout && (
              <Title size="xs">
                The safe app is taking longer than usual to load. There might be a problem with the app provider.
              </Title>
            )}
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
        onUserConfirm={onUserTxConfirm}
        params={confirmTransactionModal.params}
        onTxReject={onTxReject}
      />
    </AppWrapper>
  )
}

export default AppFrame
