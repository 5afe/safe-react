import { Card, FixedIcon, IconText, Loader, Menu, Title } from '@gnosis.pm/safe-react-components'
import { withSnackbar } from 'notistack'
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import ManageApps from './components/ManageApps'
import confirmTransactions from './confirmTransactions'
import sendTransactions from './sendTransactions'
import LegalDisclaimer from './components/LegalDisclaimer'
import { useLegalConsent } from './hooks/useLegalConsent'
import { useAppList } from './hooks/useAppList'

import LCL from 'src/components/ListContentLayout'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { SAFELIST_ADDRESS } from 'src/routes/routes'
import { grantedSelector } from 'src/routes/safe/container/selector'
import {
  safeEthBalanceSelector,
  safeNameSelector,
  safeParamAddressFromStateSelector,
} from 'src/routes/safe/store/selectors'
import { isSameHref } from 'src/utils/url'

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
  const { appList, loadingAppList, onAppToggle, onAppAdded } = useAppList()

  const [initialAppSelected, setInitialAppSelected] = useState<boolean>(false)
  const [appIsLoading, setAppIsLoading] = useState<boolean>(true)
  const [selectedAppId, setSelectedAppId] = useState<string>()
  const [iframeEl, setIframeEl] = useState<HTMLIFrameElement | null>(null)

  const history = useHistory()
  const granted = useSelector(grantedSelector)
  const safeName = useSelector(safeNameSelector)
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const network = useSelector(networkSelector)
  const ethBalance = useSelector(safeEthBalanceSelector)
  const dispatch = useDispatch()
  const { consentReceived, onConsentReceipt } = useLegalConsent()

  const selectedApp = useMemo(() => appList.find((app) => app.id === selectedAppId), [appList, selectedAppId])

  const onSelectApp = useCallback(
    (appId) => {
      if (selectedAppId === appId) {
        return
      }
      console.log({ selectedAppId, appId })
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

  const iframeRef = useCallback((node) => {
    if (node !== null) {
      setIframeEl(node)
    }
  }, [])

  const redirectToBalance = () => history.push(`${SAFELIST_ADDRESS}/${safeAddress}/balances`)

  const getContent = () => {
    if (!selectedApp) {
      return null
    }

    if (!consentReceived) {
      return <LegalDisclaimer onCancel={redirectToBalance} onConfirm={onConsentReceipt} />
    }

    if (network === 'UNKNOWN' || !granted) {
      return (
        <Centered style={{ height: '476px' }}>
          <FixedIcon type="notOwner" />
          <Title size="xs">To use apps, you must be an owner of this Safe</Title>
        </Centered>
      )
    }

    return (
      <IframeWrapper>
        {appIsLoading && (
          <IframeCoverLoading>
            <Loader size="md" />
          </IframeCoverLoading>
        )}
        <StyledIframe
          frameBorder="0"
          id={`iframe-${selectedApp.name}`}
          ref={iframeRef}
          src={selectedApp.url}
          title={selectedApp.name}
        />
      </IframeWrapper>
    )
  }

  const enabledApps = useMemo(() => appList.filter((a) => !a.disabled), [appList])

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
  })

  // on iframe change
  useEffect(() => {
    const sendMessageToIframe = (messageId, data) => {
      iframeEl.contentWindow.postMessage({ messageId, data }, selectedApp.url)
    }
    const onIframeLoaded = () => {
      setAppIsLoading(false)
      sendMessageToIframe(operations.ON_SAFE_INFO, {
        safeAddress,
        network,
        ethBalance,
      })
    }

    if (!iframeEl || !selectedApp || !isSameHref(iframeEl.src, selectedApp.url)) {
      return
    }

    iframeEl.addEventListener('load', onIframeLoaded)

    return () => {
      iframeEl.removeEventListener('load', onIframeLoaded)
    }
  }, [ethBalance, iframeEl, network, safeAddress, selectedApp])

  if (loadingAppList || !appList.length) {
    return <Loader size="md" />
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
          <LCL.Content>{getContent()}</LCL.Content>
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
