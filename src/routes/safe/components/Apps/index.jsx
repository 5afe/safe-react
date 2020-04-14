// @flow
import { withSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import ManageApps from './ManageApps'
import confirmTransactions from './confirmTransactions'
import sendTransactions from './sendTransactions'
import { getAppInfoFromUrl, staticAppsList } from './utils'

import { ListContentLayout as LCL, Loader } from '~/components-v2'
import ButtonLink from '~/components/layout/ButtonLink'
import { loadFromStorage, saveToStorage } from '~/utils/storage'

const APPS_STORAGE_KEY = 'APPS_STORAGE_KEY'

const StyledIframe = styled.iframe`
  width: 100%;
  height: 100%;
  display: ${(props) => (props.shouldDisplay ? 'block' : 'none')};
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
      const persistedAppList = (await loadFromStorage(APPS_STORAGE_KEY)) || []
      const list = [...persistedAppList]

      staticAppsList.forEach((staticApp) => {
        if (!list.some((persistedApp) => persistedApp.url === staticApp.url)) {
          list.push(staticApp)
        }
      })

      const apps = []
      for (let index = 0; index < list.length; index++) {
        try {
          const currentApp = list[index]
          if (currentApp.disabled) {
            continue
          }

          const appInfo = await getAppInfoFromUrl(currentApp.url)

          if (appInfo.error) {
            throw Error()
          }

          apps.push(appInfo)
        } catch (error) {
          console.error(error)
        }
      }

      setAppList([...apps])
      setLoading(false)
    }

    if (!appList.length) {
      loadApps()
    }
  }, [appList])

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

  const onSelectApp = (appId) => {
    setAppIsLoading(true)
    setSelectedApp(appId)
  }

  const getContent = () => {
    if (!selectedApp) {
      return null
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
    const newAppList = [...appList, { url: app.url, disabled: false }].map((a) => ({
      url: a.url,
      disabled: a.disabled,
    }))

    saveToStorage(APPS_STORAGE_KEY, newAppList)
    setAppList([...appList, { ...app, disabled: false }])
  }

  if (loading || !appList.length) {
    return <Loader />
  }

  return (
    <LCL.Wrapper>
      <LCL.Nav>
        <ManageApps appList={appList} onAppAdded={onAppAdded} />
      </LCL.Nav>
      <LCL.Menu>
        <LCL.List activeItem={selectedApp} items={appList} onItemClick={onSelectApp} />
      </LCL.Menu>
      <LCL.Content>{getContent()}</LCL.Content>
      <LCL.Footer>
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
      </LCL.Footer>
    </LCL.Wrapper>
  )
}

export default withSnackbar(Apps)
