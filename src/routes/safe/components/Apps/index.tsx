import { Card, FixedDialog, FixedIcon, IconText, Loader, Menu, Text, Title } from '@gnosis.pm/safe-react-components'
import { withSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import ManageApps from './ManageApps'
import confirmTransactions from './confirmTransactions'
import sendTransactions from './sendTransactions'
import { getAppInfoFromUrl, staticAppsList } from './utils'

import LCL from 'src/components/ListContentLayout'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { grantedSelector } from 'src/routes/safe/container/selector'
import {
  safeEthBalanceSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector,
} from 'src/routes/safe/store/selectors'
import { loadFromStorage, saveToStorage } from 'src/utils/storage'
import { isSameHref } from 'src/utils/url'
import { SafeApp, StoredSafeApp } from './types'

const APPS_STORAGE_KEY = 'APPS_STORAGE_KEY'
const APPS_LEGAL_DISCLAIMER_STORAGE_KEY = 'APPS_LEGAL_DISCLAIMER_STORAGE_KEY'

const StyledIframe = styled.iframe`
  padding: 15px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`
const Centered = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const CenteredMT = styled(Centered)`
  margin-top: 5px;
`

const IframeWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`

const IframeCoverLoading = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
`
const operations = {
  SEND_TRANSACTIONS: 'SEND_TRANSACTIONS',
  ON_SAFE_INFO: 'ON_SAFE_INFO',
}

function Apps({ closeModal, closeSnackbar, enqueueSnackbar, openModal }) {
  const [appList, setAppList] = useState<Array<SafeApp>>([])
  const [legalDisclaimerAccepted, setLegalDisclaimerAccepted] = useState(false)
  const [selectedApp, setSelectedApp] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [appIsLoading, setAppIsLoading] = useState(true)
  const [iframeEl, setIframeEl] = useState<HTMLIFrameElement | null>(null)

  const history = useHistory()
  const granted = useSelector(grantedSelector)
  const safeName = useSelector(safeNameSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const network = useSelector(networkSelector)
  const ethBalance = useSelector(safeEthBalanceSelector)
  const dispatch = useDispatch()

  const getSelectedApp = useCallback(() => appList.find((e) => e.id === selectedApp), [appList, selectedApp])

  const iframeRef = useCallback((node) => {
    if (node !== null) {
      setIframeEl(node)
    }
  }, [])

  const onSelectApp = useCallback(
    (appId) => {
      const selectedApp = getSelectedApp()

      if (selectedApp && selectedApp.id === appId) {
        return
      }

      setAppIsLoading(true)
      setSelectedApp(appId)
    },
    [getSelectedApp],
  )

  const redirectToBalance = () => history.push(`${SAFELIST_ADDRESS}/${safeAddress}/balances`)

  const onAcceptLegalDisclaimer = () => {
    setLegalDisclaimerAccepted(true)
    saveToStorage(APPS_LEGAL_DISCLAIMER_STORAGE_KEY, true)
  }

  const getContent = () => {
    if (!selectedApp) {
      return null
    }

    if (!legalDisclaimerAccepted) {
      return (
        <FixedDialog
          body={
            <>
              <Text size="md">
                You are now accessing third-party apps, which we do not own, control, maintain or audit. We are not
                liable for any loss you may suffer in connection with interacting with the apps, which is at your own
                risk. You must read our Terms, which contain more detailed provisions binding on you relating to the
                apps.
              </Text>
              <br />
              <Text size="md">
                I have read and understood the{' '}
                <a href="https://gnosis-safe.io/terms" rel="noopener noreferrer" target="_blank">
                  Terms
                </a>{' '}
                and this Disclaimer, and agree to be bound by them.
              </Text>
            </>
          }
          onCancel={redirectToBalance}
          onConfirm={onAcceptLegalDisclaimer}
          title="Disclaimer"
        />
      )
    }

    if (network === 'UNKNOWN' || !granted) {
      return (
        <Centered style={{ height: '476px' }}>
          <FixedIcon type="notOwner" />
          <Title size="xs">To use apps, you must be an owner of this Safe</Title>
        </Centered>
      )
    }

    const app = getSelectedApp()

    return (
      <IframeWrapper>
        {appIsLoading && (
          <IframeCoverLoading>
            <Loader size="md" />
          </IframeCoverLoading>
        )}
        <StyledIframe frameBorder="0" id={`iframe-${app.name}`} ref={iframeRef} src={app.url} title={app.name} />
      </IframeWrapper>
    )
  }

  const onAppAdded = (app: SafeApp) => {
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

  const selectFirstApp = useCallback(
    (apps) => {
      const firstEnabledApp = apps.find((a) => !a.disabled)
      if (firstEnabledApp) {
        onSelectApp(firstEnabledApp.id)
      }
    },
    [onSelectApp],
  )

  const onAppToggle = async (appId, enabled) => {
    // update in-memory list
    const copyAppList = [...appList]

    const app = copyAppList.find((a) => a.id === appId)
    if (!app) {
      return
    }

    app.disabled = !enabled
    setAppList(copyAppList)

    // update storage list
    const persistedAppList = (await loadFromStorage<StoredSafeApp[]>(APPS_STORAGE_KEY)) || []
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
    const handleIframeMessage = (data) => {
      if (!data || !data.messageId) {
        console.error('ThirdPartyApp: A message was received without message id.')
        return
      }

      switch (data.messageId) {
        case operations.SEND_TRANSACTIONS: {
          const onConfirm = async () => {
            closeModal()

            await sendTransactions(
              dispatch,
              safeAddress,
              data.data,
              enqueueSnackbar,
              closeSnackbar,
              getSelectedApp().id,
            )
          }

          confirmTransactions(
            safeAddress,
            safeName,
            ethBalance,
            getSelectedApp().name,
            getSelectedApp().iconUrl,
            data.data,
            openModal,
            closeModal,
            onConfirm,
          )

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

      const app = getSelectedApp()
      if (!app.url.includes(origin)) {
        console.error(`ThirdPartyApp: A message was received from an unknown origin ${origin}`)
        return
      }

      handleIframeMessage(data)
    }

    window.addEventListener('message', onIframeMessage)

    return () => {
      window.removeEventListener('message', onIframeMessage)
    }
  })

  // load legalDisclaimer
  useEffect(() => {
    const checkLegalDisclaimer = async () => {
      const legalDisclaimer = await loadFromStorage(APPS_LEGAL_DISCLAIMER_STORAGE_KEY)

      if (legalDisclaimer) {
        setLegalDisclaimerAccepted(true)
      }
    }

    checkLegalDisclaimer()
  }, [])

  // Load apps list
  useEffect(() => {
    const loadApps = async () => {
      // recover apps from storage:
      // * third-party apps added by the user
      // * disabled status for both static and third-party apps
      const persistedAppList = (await loadFromStorage<StoredSafeApp[]>(APPS_STORAGE_KEY)) || []
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

          const appInfo: any = await getAppInfoFromUrl(currentApp.url)
          if (appInfo.error) {
            throw Error(`There was a problem trying to load app ${currentApp.url}`)
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
  }, [appList.length, selectFirstApp])

  // on iframe change
  useEffect(() => {
    const sendMessageToIframe = (messageId, data) => {
      const app = getSelectedApp()
      iframeEl.contentWindow.postMessage({ messageId, data }, app.url)
    }
    const onIframeLoaded = () => {
      setAppIsLoading(false)
      sendMessageToIframe(operations.ON_SAFE_INFO, {
        safeAddress,
        network,
        ethBalance,
      })
    }

    const app = getSelectedApp()
    if (!iframeEl || !selectedApp || !isSameHref(iframeEl.src, app.url)) {
      return
    }

    iframeEl.addEventListener('load', onIframeLoaded)

    return () => {
      iframeEl.removeEventListener('load', onIframeLoaded)
    }
  }, [ethBalance, getSelectedApp, iframeEl, network, safeAddress, selectedApp])

  if (loading) {
    return <Loader size="md" />
  }

  if (loading || !appList.length) {
    return <Loader size="md" />
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
