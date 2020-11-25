import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { INTERFACE_MESSAGES, Transaction, RequestId, LowercaseNetworks } from '@gnosis.pm/safe-apps-sdk-v1'
import { Card, IconText, Loader, Menu, Title } from '@gnosis.pm/safe-react-components'
import { MethodToResponse, RPCPayload } from '@gnosis.pm/safe-apps-sdk'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

import ManageApps from './components/ManageApps'
import AppFrame from './components/AppFrame'
import { useAppList } from './hooks/useAppList'
import { SafeApp } from './types.d'

import LCL from 'src/components/ListContentLayout'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { web3ReadOnly } from 'src/logic/wallets/getWeb3'
import {
  safeEthBalanceSelector,
  safeParamAddressFromStateSelector,
  safeNameSelector,
} from 'src/logic/safe/store/selectors'
import { isSameURL } from 'src/utils/url'
import { useIframeMessageHandler } from './hooks/useIframeMessageHandler'
import ConfirmTransactionModal from './components/ConfirmTransactionModal'
import { useAnalytics, SAFE_NAVIGATION_EVENT } from 'src/utils/googleAnalytics'
import { getNetworkName, getTxServiceUrl } from 'src/config'
import { useAppCommunicator } from './communicator'

const centerCSS = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  ${centerCSS};
`

const StyledCard = styled(Card)`
  margin-bottom: 24px;
  ${centerCSS};
`

const CenteredMT = styled.div`
  ${centerCSS};
  margin-top: 16px;
`

export type TransactionParams = {
  safeTxGas?: number
}

type ConfirmTransactionModalState = {
  isOpen: boolean
  txs: Transaction[]
  requestId?: RequestId
  params?: TransactionParams
}

const INITIAL_CONFIRM_TX_MODAL_STATE: ConfirmTransactionModalState = {
  isOpen: false,
  txs: [],
  requestId: undefined,
  params: undefined,
}

const NETWORK_NAME = getNetworkName()

const Apps = (): React.ReactElement => {
  const { appList, loadingAppList, onAppToggle, onAppAdded, onAppRemoved } = useAppList()

  const [appIsLoading, setAppIsLoading] = useState<boolean>(true)
  const [selectedAppId, setSelectedAppId] = useState<string>()
  const [confirmTransactionModal, setConfirmTransactionModal] = useState<ConfirmTransactionModalState>(
    INITIAL_CONFIRM_TX_MODAL_STATE,
  )
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const { trackEvent } = useAnalytics()
  const granted = useSelector(grantedSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const safeName = useSelector(safeNameSelector)
  const ethBalance = useSelector(safeEthBalanceSelector) as string

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

  const selectedApp = useMemo(() => appList.find((app) => app.id === selectedAppId), [appList, selectedAppId])
  const enabledApps = useMemo(() => appList.filter((a) => !a.disabled), [appList])
  const { sendMessageToIframe } = useIframeMessageHandler(
    selectedApp,
    openConfirmationModal,
    closeConfirmationModal,
    iframeRef,
  )
  const communicator = useAppCommunicator(iframeRef, selectedApp)

  useEffect(() => {
    communicator?.on('getEnvInfo', () => ({
      txServiceUrl: getTxServiceUrl(),
    }))

    communicator?.on('getSafeInfo', () => ({
      safeAddress,
      network: NETWORK_NAME,
    }))

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
    communicator?.send({ safeTxHash }, confirmTransactionModal.requestId)
  }

  const onTxReject = () => {
    // Safe Apps SDK V1 Handler
    sendMessageToIframe(
      { messageId: INTERFACE_MESSAGES.TRANSACTION_REJECTED, data: {} },
      confirmTransactionModal.requestId,
    )

    // Safe Apps SDK V2 Handler
    communicator?.send('Transaction was rejected', confirmTransactionModal.requestId, true)
  }

  const onSelectApp = useCallback(
    (appId) => {
      if (selectedAppId === appId) {
        return
      }

      setAppIsLoading(true)
      setSelectedAppId(appId)
    },
    [selectedAppId],
  )

  // Auto Select app first App
  useEffect(() => {
    const selectFirstEnabledApp = () => {
      const firstEnabledApp = appList.find((a) => !a.disabled)
      if (firstEnabledApp) {
        setSelectedAppId(firstEnabledApp.id)
      }
    }

    const initialSelect = appList.length && !selectedAppId
    const currentAppWasDisabled = selectedApp?.disabled
    if (initialSelect || currentAppWasDisabled) {
      selectFirstEnabledApp()
    }
  }, [appList, selectedApp, selectedAppId, trackEvent])

  // track GA
  useEffect(() => {
    if (selectedApp) {
      trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Apps', label: selectedApp.name })
    }
  }, [selectedApp, trackEvent])

  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe || !selectedApp || !isSameURL(iframe.src, selectedApp.url)) {
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
  }, [ethBalance, safeAddress, selectedApp, sendMessageToIframe])

  if (loadingAppList || !appList.length || !safeAddress) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  return (
    <>
      <Menu>
        <ManageApps appList={appList} onAppAdded={onAppAdded} onAppToggle={onAppToggle} onAppRemoved={onAppRemoved} />
      </Menu>
      {enabledApps.length ? (
        <LCL.Wrapper>
          <LCL.Menu>
            <LCL.List activeItem={selectedAppId} items={enabledApps} onItemClick={onSelectApp} />
          </LCL.Menu>
          <LCL.Content>
            <AppFrame
              ref={iframeRef}
              granted={granted}
              selectedApp={selectedApp}
              safeAddress={safeAddress}
              network={NETWORK_NAME}
              appIsLoading={appIsLoading}
              onIframeLoad={handleIframeLoad}
            />
          </LCL.Content>
        </LCL.Wrapper>
      ) : (
        <StyledCard>
          <Title size="xs">No Apps Enabled</Title>
        </StyledCard>
      )}
      <CenteredMT>
        <IconText
          color="secondary"
          iconSize="sm"
          iconType="info"
          text="
          These are third-party apps, which means they are not owned, controlled, maintained or audited by Gnosis.
          Interacting with the apps is at your own risk.
          Any communication within the Apps is for informational purposes only and must not be construed as investment advice to engage in any transaction."
          textSize="sm"
        />
      </CenteredMT>
      <ConfirmTransactionModal
        isOpen={confirmTransactionModal.isOpen}
        app={selectedApp as SafeApp}
        safeAddress={safeAddress}
        ethBalance={ethBalance as string}
        safeName={safeName as string}
        txs={confirmTransactionModal.txs}
        onClose={closeConfirmationModal}
        onUserConfirm={onUserTxConfirm}
        params={confirmTransactionModal.params}
        onTxReject={onTxReject}
      />
    </>
  )
}

export default Apps
