// @flow
import { Card, Menu, Title } from '@gnosis/safe-react-components'
import { withSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import ManageApps from './ManageApps'
import confirmTransactions from './confirmTransactions'
import sendTransactions from './sendTransactions'
import { getAppInfoFromUrl, staticAppsList } from './utils'

import { ListContentLayout as LCL, Loader } from '~/components-v2'
import { loadFromStorage, saveToStorage } from '~/utils/storage'

const APPS_STORAGE_KEY = 'APPS_STORAGE_KEY'

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  display: ${(props) => (props.shouldDisplay ? 'block' : 'none')};
`

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const operations = {
  SEND_TRANSACTIONS: 'sendTransactions',
  GET_TRANSACTIONS: 'getTransactions',
  ON_SAFE_INFO: 'onSafeInfo',
  ON_TX_UPDATE: 'onTransactionUpdate',
}

type Props = {
  web3: any,
  safeAddress: String,
  safeName: String,
  ethBalance: String,
  network: String,
  granted: Boolean,
  createTransaction: any,
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  openModal: () => {},
  closeModal: () => {},
}

function Apps({
  closeModal,
  closeSnackbar,
  createTransaction,
  enqueueSnackbar,
  ethBalance,
  granted,
  network,
  openModal,
  safeAddress,
  safeName,
  web3,
}: Props) {
  const [appList, setAppList] = useState([])
  const [selectedApp, setSelectedApp] = useState()
  const [loading, setLoading] = useState(true)
  const [appIsLoading, setAppIsLoading] = useState(true)
  const [iframeEl, setIframeEl] = useState(null)

  const getSelectedApp = () => appList.find((e) => e.id === selectedApp)

  const sendMessageToIframe = (messageId, data) => {
    iframeEl.contentWindow.postMessage({ messageId, data }, getSelectedApp().url)
  }

  const handleIframeMessage = async (data) => {
    if (!data || !data.messageId) {
      console.warn('iframe: message without messageId')
      return
    }

    switch (data.messageId) {
      case operations.SEND_TRANSACTIONS: {
        const onConfirm = async () => {
          closeModal()

          const txHash = await sendTransactions(
            web3,
            createTransaction,
            safeAddress,
            data.data,
            enqueueSnackbar,
            closeSnackbar,
            getSelectedApp().id,
          )

          if (txHash) {
            sendMessageToIframe(operations.ON_TX_UPDATE, {
              txHash,
              status: 'pending',
            })
          }
        }

        confirmTransactions(
          safeAddress,
          safeName,
          ethBalance,
          getSelectedApp().iconUrl,
          data.data,
          openModal,
          closeModal,
          onConfirm,
        )

        break
      }
      case operations.GET_TRANSACTIONS:
        break

      default: {
        console.warn(`Iframe:${data.messageId} unkown`)
        break
      }
    }
  }

  const iframeRef = useCallback((node) => {
    if (node !== null) {
      setIframeEl(node)
    }
  }, [])

  const onSelectApp = (appId) => {
    const selectedApp = getSelectedApp()

    if (selectedApp && selectedApp.id === appId) {
      return
    }

    setAppIsLoading(true)
    setSelectedApp(appId)
  }

  const getContent = () => {
    if (!selectedApp) {
      return null
    }

    if (network === 'UNKNOWN' || !granted) {
      return <div>not network selected</div>
    }

    return (
      <>
        {appIsLoading && <Loader />}
        <StyledIframe
          frameBorder="0"
          id="iframeId"
          ref={iframeRef}
          shouldDisplay={!appIsLoading}
          src={getSelectedApp().url}
          title={getSelectedApp().name}
        />
      </>
    )
  }

  const onAppAdded = (app) => {
    const newAppList = [
      { url: app.url, disabled: false },
      ...appList.map((a) => ({
        url: a.url,
        disabled: a.disabled,
      })),
    ]
    saveToStorage(APPS_STORAGE_KEY, newAppList)

    setAppList([...appList, { ...app, disabled: false }])
  }

  const selectFirstApp = (apps) => {
    const firstEnabledApp = apps.find((a) => !a.disabled)
    if (firstEnabledApp) {
      onSelectApp(firstEnabledApp.id)
    }
  }

  const onAppToggle = async (appId: string, enabled: boolean) => {
    // update in-memory list
    const copyAppList = [...appList]

    const app = copyAppList.find((a) => a.id === appId)
    if (!app) {
      return
    }

    app.disabled = !enabled
    setAppList(copyAppList)

    // update storage list
    const persistedAppList = (await loadFromStorage(APPS_STORAGE_KEY)) || []
    let storageApp = persistedAppList.find((a) => a.url === app.url)

    if (!storageApp) {
      storageApp = { url: app.url }
      storageApp.disabled = !enabled
      persistedAppList.push(storageApp)
    } else {
      storageApp.disabled = !enabled
    }

    saveToStorage(APPS_STORAGE_KEY, persistedAppList)

    // select app
    const selectedApp = getSelectedApp()
    if (!selectedApp || (selectedApp && selectedApp.id === appId)) {
      setSelectedApp(undefined)
      selectFirstApp(copyAppList)
    }
  }

  const getEnabledApps = () => appList.filter((a) => !a.disabled)

  // handle messages from iframe
  useEffect(() => {
    const onIframeMessage = async ({ data, origin }) => {
      if (origin === window.origin) {
        return
      }

      if (!getSelectedApp().url.includes(origin)) {
        console.error(`Message from ${origin} is different to the App URL ${getSelectedApp().url}`)
        return
      }

      handleIframeMessage(data)
    }

    window.addEventListener('message', onIframeMessage)

    return () => {
      window.removeEventListener('message', onIframeMessage)
    }
  })

  // Load apps list
  useEffect(() => {
    const loadApps = async () => {
      // recover apps from storage:
      // * third-party apps added by the user
      // * disabled status for both static and third-party apps
      const persistedAppList = (await loadFromStorage(APPS_STORAGE_KEY)) || []
      const list = [...persistedAppList]

      staticAppsList.forEach((staticApp) => {
        if (!list.some((persistedApp) => persistedApp.url === staticApp.url)) {
          list.push(staticApp)
        }
      })

      const apps = []
      // using the appURL to recover app info
      for (let index = 0; index < list.length; index++) {
        try {
          const currentApp = list[index]

          const appInfo = await getAppInfoFromUrl(currentApp.url)

          if (appInfo.error) {
            throw Error()
          }

          appInfo.disabled = currentApp.disabled === undefined ? false : currentApp.disabled

          apps.push(appInfo)
        } catch (error) {
          console.error(error)
        }
      }

      setAppList(apps)
      setLoading(false)
      selectFirstApp(apps)
    }

    if (!appList.length) {
      loadApps()
    }
  }, [])

  // on iframe change
  useEffect(() => {
    const onIframeLoaded = () => {
      setAppIsLoading(false)
      sendMessageToIframe(operations.ON_SAFE_INFO, {
        safeAddress,
        network,
        ethBalance,
      })
    }

    if (!iframeEl) {
      return
    }

    iframeEl.addEventListener('load', onIframeLoaded)

    return () => {
      iframeEl.removeEventListener('load', onIframeLoaded)
    }
  }, [iframeEl])

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <Menu>
        <ManageApps appList={appList} onAppAdded={onAppAdded} onAppToggle={onAppToggle} />
      </Menu>
      {getEnabledApps().length ? (
        <LCL.Wrapper>
          <LCL.Menu>
            <LCL.List activeItem={selectedApp} items={getEnabledApps()} onItemClick={onSelectApp} />
          </LCL.Menu>
          <LCL.Content>{getContent()}</LCL.Content>
          {/* <LCL.Footer>
            {getSelectedApp() && getSelectedApp().providedBy && (
              <>
                <p>This App is provided by </p>
                <ButtonLink
                  onClick={() => window.open(getSelectedApp().providedBy.url, '_blank')}
                  size="lg"
                  testId="manage-tokens-btn"
                >
                  {selectedApp && getSelectedApp().providedBy.name}
                </ButtonLink>
              </>
            )}
          </LCL.Footer> */}
        </LCL.Wrapper>
      ) : (
        <Card>
          <Centered>
            <Title size="xs">No Apps Enabled</Title>
          </Centered>
        </Card>
      )}
    </>
  )
}

export default withSnackbar(Apps)
