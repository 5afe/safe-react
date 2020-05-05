// @flow
import { Card, FixedDialog, FixedIcon, IconText, Menu, Text, Title } from '@gnosis.pm/safe-react-components'
import { withSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import ManageApps from './ManageApps'
import confirmTransactions from './confirmTransactions'
import sendTransactions from './sendTransactions'
import { getAppInfoFromUrl, staticAppsList } from './utils'

import { ListContentLayout as LCL, Loader } from '~/components-v2'
import { networkSelector } from '~/logic/wallets/store/selectors'
import { SAFELIST_ADDRESS } from '~/routes/routes'
import { grantedSelector } from '~/routes/safe/container/selector'
import {
  safeEthBalanceSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector,
} from '~/routes/safe/store/selectors'
import { loadFromStorage, saveToStorage } from '~/utils/storage'
import { isSameHref } from '~/utils/url'

const APPS_STORAGE_KEY = 'APPS_STORAGE_KEY'
const APPS_LEGAL_DISCLAIMER_STORAGE_KEY = 'APPS_LEGAL_DISCLAIMER_STORAGE_KEY'

const StyledIframe = styled.iframe`
  padding: 24px;
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
const operations = {
  SEND_TRANSACTIONS: 'SEND_TRANSACTIONS',
  ON_SAFE_INFO: 'ON_SAFE_INFO',
}

type Props = {
  enqueueSnackbar: Function,
  closeSnackbar: Function,
  openModal: () => {},
  closeModal: () => {},
}

function Apps({ closeModal, closeSnackbar, enqueueSnackbar, openModal }: Props) {
  const [appList, setAppList] = useState([])
  const [legalDisclaimerAccepted, setLegalDisclaimerAccepted] = useState(false)
  const [selectedApp, setSelectedApp] = useState()
  const [loading, setLoading] = useState(true)
  const [appIsLoading, setAppIsLoading] = useState(true)
  const [iframeEl, setIframeEl] = useState(null)
  const history = useHistory()
  const granted = useSelector(grantedSelector)
  const safeName = useSelector(safeNameSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const network = useSelector(networkSelector)
  const ethBalance = useSelector(safeEthBalanceSelector)
  const dispatch = useDispatch()

  const getSelectedApp = () => appList.find((e) => e.id === selectedApp)

  const sendMessageToIframe = (messageId, data) => {
    const app = getSelectedApp()
    iframeEl.contentWindow.postMessage({ messageId, data }, app.url)
  }

  const handleIframeMessage = async (data) => {
    if (!data || !data.messageId) {
      console.error('ThirdPartyApp: A message was received without message id.')
      return
    }

    switch (data.messageId) {
      case operations.SEND_TRANSACTIONS: {
        const onConfirm = async () => {
          closeModal()

          await sendTransactions(dispatch, safeAddress, data.data, enqueueSnackbar, closeSnackbar, getSelectedApp().id)
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
      <>
        {appIsLoading && <Loader />}
        <StyledIframe
          frameBorder="0"
          id={`iframe-${app.name}`}
          ref={iframeRef}
          shouldDisplay={!appIsLoading}
          src={app.url}
          title={app.name}
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
  }, [selectedApp])

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

    const app = getSelectedApp()
    if (!iframeEl || !selectedApp || !isSameHref(iframeEl.src, app.url)) {
      return
    }

    iframeEl.addEventListener('load', onIframeLoaded)

    return () => {
      iframeEl.removeEventListener('load', onIframeLoaded)
    }
  }, [iframeEl, selectedApp])

  if (loading) {
    return <Loader />
  }

  if (loading || !appList.length) {
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
        <Card style={{ marginBottom: '24px' }}>
          <Centered>
            <Title size="xs">No Apps Enabled</Title>
          </Centered>
        </Card>
      )}
      <Centered>
        <IconText
          color="secondary"
          iconSize="sm"
          iconType="info"
          text="These are third-party apps, which means they are not owned, controlled, maintained or audited by Gnosis. Interacting with the apps is at your own risk."
          textSize="sm"
        />
      </Centered>
    </>
  )
}

export default withSnackbar(Apps)
