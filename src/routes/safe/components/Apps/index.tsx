import { Card, IconText, Loader, Menu, Title } from '@gnosis.pm/safe-react-components'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

import ManageApps from './components/ManageApps'
import confirmTransactions from './confirmTransactions'
import sendTransactions from './sendTransactions'
import AppFrame from './components/AppFrame'
import { useAppList } from './hooks/useAppList'
import { OpenModalArgs } from 'src/routes/safe/components/Layout/interfaces'

import LCL from 'src/components/ListContentLayout'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import {
  safeEthBalanceSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector,
} from 'src/routes/safe/store/selectors'
import { isSameHref } from 'src/utils/url'

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
  margin-top: 5px;
`

const operations = {
  ON_SAFE_INFO: 'ON_SAFE_INFO',
  SAFE_APP_SDK_INITIALIZED: 'SAFE_APP_SDK_INITIALIZED',
  SEND_TRANSACTIONS: 'SEND_TRANSACTIONS',
}

type AppsProps = {
  closeModal: () => void
  openModal: (modal: OpenModalArgs) => void
}

const Apps = ({ closeModal, openModal }: AppsProps): React.ReactElement => {
  const { appList, loadingAppList, onAppToggle, onAppAdded } = useAppList()

  const [appIsLoading, setAppIsLoading] = useState<boolean>(true)
  const [selectedAppId, setSelectedAppId] = useState<string>()
  const iframeRef = useRef<HTMLIFrameElement>()

  const granted = useSelector(grantedSelector)
  const safeName = useSelector(safeNameSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const network = useSelector(networkSelector)
  const ethBalance = useSelector(safeEthBalanceSelector)
  const dispatch = useDispatch()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const selectedApp = useMemo(() => appList.find((app) => app.id === selectedAppId), [appList, selectedAppId])
  const enabledApps = useMemo(() => appList.filter((a) => !a.disabled), [appList])

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
  }, [appList, selectedApp, selectedAppId])

  const sendMessageToIframe = useCallback(
    (messageId, data) => {
      if (iframeRef.current && selectedApp) {
        iframeRef.current.contentWindow.postMessage({ messageId, data }, selectedApp.url)
      }
    },
    [selectedApp],
  )

  // handle messages from iframe
  useEffect(() => {
    const handleIframeMessage = (data) => {
      if (!data || !data.messageId) {
        console.error('ThirdPartyApp: A message was received without message id.')
        return
      }

      switch (data.messageId) {
        case operations.SEND_TRANSACTIONS: {
          const onConfirm = async () => {
            closeModal()

            await sendTransactions(dispatch, safeAddress, data.data, enqueueSnackbar, closeSnackbar, selectedApp.id)
          }

          confirmTransactions(
            safeAddress,
            safeName,
            ethBalance,
            selectedApp.name,
            selectedApp.iconUrl,
            data.data,
            openModal,
            closeModal,
            onConfirm,
          )
          break
        }

        case operations.SAFE_APP_SDK_INITIALIZED: {
          sendMessageToIframe(operations.ON_SAFE_INFO, {
            safeAddress,
            network,
            ethBalance,
          })
          break
        }

        default: {
          console.error(`ThirdPartyApp: A message was received with an unknown message id ${data.messageId}.`)
          break
        }
      }
    }

    const onIframeMessage = async ({ data, origin }) => {
      if (origin === window.origin) {
        return
      }

      if (!selectedApp.url.includes(origin)) {
        console.error(`ThirdPartyApp: A message was received from an unknown origin ${origin}`)
        return
      }

      handleIframeMessage(data)
    }

    window.addEventListener('message', onIframeMessage)

    return () => {
      window.removeEventListener('message', onIframeMessage)
    }
  }, [
    closeModal,
    closeSnackbar,
    dispatch,
    enqueueSnackbar,
    ethBalance,
    network,
    openModal,
    safeAddress,
    safeName,
    selectedApp,
    sendMessageToIframe,
  ])

  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe || !selectedApp || !isSameHref(iframe.src, selectedApp.url)) {
      return
    }

    setAppIsLoading(false)
    sendMessageToIframe(operations.ON_SAFE_INFO, {
      safeAddress,
      network,
      ethBalance,
    })
  }, [ethBalance, network, safeAddress, selectedApp, sendMessageToIframe])

  if (loadingAppList || !appList.length) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  return (
    <>
      <Menu>
        <ManageApps appList={appList} onAppAdded={onAppAdded} onAppToggle={onAppToggle} />
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
              network={network}
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
          text="These are third-party apps, which means they are not owned, controlled, maintained or audited by Gnosis. Interacting with the apps is at your own risk."
          textSize="sm"
        />
      </CenteredMT>
    </>
  )
}

export default Apps
