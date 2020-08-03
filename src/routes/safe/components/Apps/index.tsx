import { Card, IconText, Loader, Menu, Title } from '@gnosis.pm/safe-react-components'
import { withSnackbar } from 'notistack'
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import ManageApps from './components/ManageApps'
import confirmTransactions from './confirmTransactions'
import sendTransactions from './sendTransactions'
import AppFrame from './components/AppFrame'
import { useAppList } from './hooks/useAppList'

import LCL from 'src/components/ListContentLayout'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import {
  safeEthBalanceSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector,
} from 'src/routes/safe/store/selectors'
import { isSameHref } from 'src/utils/url'

const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const CenteredMT = styled(Centered)`
  margin-top: 5px;
`

const operations = {
  ON_SAFE_INFO: 'ON_SAFE_INFO',
  SAFE_APP_SDK_INITIALIZED: 'SAFE_APP_SDK_INITIALIZED',
  SEND_TRANSACTIONS: 'SEND_TRANSACTIONS',
}

const Apps = ({ closeModal, closeSnackbar, enqueueSnackbar, openModal }) => {
  const { appList, loadingAppList, onAppToggle, onAppAdded } = useAppList()

  const [initialAppSelected, setInitialAppSelected] = useState<boolean>(false)
  const [appIsLoading, setAppIsLoading] = useState<boolean>(true)
  const [selectedAppId, setSelectedAppId] = useState<string>()
  const iframeRef = useRef<HTMLIFrameElement>()

  const granted = useSelector(grantedSelector)
  const safeName = useSelector(safeNameSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const network = useSelector(networkSelector)
  const ethBalance = useSelector(safeEthBalanceSelector)
  const dispatch = useDispatch()

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
        setInitialAppSelected(true)
      }
    }

    if (appList.length) {
      // select the app for the first time once the list is loaded
      if (!initialAppSelected) {
        selectFirstEnabledApp()
      }

      // check if the current active app was disabled by the user
      const currentApp = appList.find((app) => selectedAppId === app.id)
      if (currentApp?.disabled) {
        selectFirstEnabledApp()
      }
    }
  }, [appList, initialAppSelected, selectedAppId])

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
        <Card style={{ marginBottom: '24px' }}>
          <Centered>
            <Title size="xs">No Apps Enabled</Title>
          </Centered>
        </Card>
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

export default withSnackbar(Apps)
