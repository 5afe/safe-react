import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { Networks } from '@gnosis.pm/safe-apps-sdk'
import { Card, IconText, Loader, Menu, Title } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'

import ManageApps from './components/ManageApps'
import AppFrame from './components/AppFrame'
import { useAppList } from './hooks/useAppList'
import { OpenModalArgs } from 'src/routes/safe/components/Layout/interfaces'

import LCL from 'src/components/ListContentLayout'
import { networkSelector } from 'src/logic/wallets/store/selectors'
import { grantedSelector } from 'src/routes/safe/container/selector'
import { safeEthBalanceSelector, safeParamAddressFromStateSelector } from 'src/routes/safe/store/selectors'
import { isSameURL } from 'src/utils/url'
import { useIframeMessageHandler } from './hooks/useIframeMessageHandler'

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
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const network = useSelector(networkSelector)
  const ethBalance = useSelector(safeEthBalanceSelector)

  const selectedApp = useMemo(() => appList.find((app) => app.id === selectedAppId), [appList, selectedAppId])
  const enabledApps = useMemo(() => appList.filter((a) => !a.disabled), [appList])
  const { sendMessageToIframe } = useIframeMessageHandler(selectedApp, openModal, closeModal, iframeRef)

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

  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe || !selectedApp || !isSameURL(iframe.src, selectedApp.url)) {
      return
    }

    setAppIsLoading(false)
    // TODO: export this from safe-apps-sdk
    sendMessageToIframe('ON_SAFE_INFO', {
      safeAddress,
      network: network as Networks,
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
