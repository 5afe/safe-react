import { ReactElement, useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { Card, Title, Loader } from '@gnosis.pm/safe-react-components'

import { isValidChainId } from 'src/config'
import { history, WELCOME_ROUTE } from 'src/routes/routes'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { getAppInfoFromUrl } from 'src/routes/safe/components/Apps/utils'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { setChainId } from 'src/logic/config/utils'
import { useQuery } from 'src/logic/hooks/useQuery'
import useAsync from 'src/logic/hooks/useAsync'
import SafeAppDetails from 'src/routes/SafeAppLandingPage/components/SafeAppsDetails'
import CreateNewSafe from 'src/routes/SafeAppLandingPage/components/CreateNewSafe'
import ConnectWallet from 'src/routes/SafeAppLandingPage/components/ConnectWallet'
import TryDemoSafe from 'src/routes/SafeAppLandingPage/components/TryDemoSafe'

const SafeAppLandingPage = (): ReactElement => {
  const query = useQuery()
  const safeAppChainId = query.get('chainId')
  const safeAppUrl = query.get('appUrl')
  const isValidChain = useMemo(() => isValidChainId(safeAppChainId), [safeAppChainId])

  // if no valid chainId is present in query params we redirect to the Welcome page
  useEffect(() => {
    // we set the valid Safe App chainId in the state
    if (isValidChain) {
      setChainId(safeAppChainId as string)
    }
  }, [safeAppChainId, isValidChain])

  const userAddress = useSelector(userAccountSelector)
  const isWalletConnected = !!userAddress

  // fetch Safe App details from the Config service
  const { appList, isLoading: isConfigServiceLoading } = useAppList()
  const safeAppDetailsFromConfigService = appList.find(({ url }) => safeAppUrl === url)

  // fetch Safe App details from Manifest.json
  const fetchManifest = useCallback(async () => {
    if (safeAppUrl) {
      return getAppInfoFromUrl(safeAppUrl)
    }

    throw new Error('No Safe App URL provided.')
  }, [safeAppUrl])

  const {
    result: safeAppDetailsFromManifest,
    error: isManifestError,
    isLoading: isManifestLoading,
  } = useAsync<SafeApp>(fetchManifest)

  const safeAppDetails = safeAppDetailsFromConfigService || safeAppDetailsFromManifest
  const isLoading = isConfigServiceLoading || isManifestLoading

  // redirect to the Welcome page if the Safe App details are invalid
  useEffect(() => {
    const isSafeAppMissing = !isLoading && !safeAppDetails

    if (isSafeAppMissing && isManifestError) {
      history.push(WELCOME_ROUTE)
    }
  }, [isLoading, safeAppDetails, isManifestError])

  const availableChains = safeAppDetails?.chainIds || []

  const showLoader = isLoading || !safeAppDetails

  if (!safeAppUrl || !isValidChain) {
    return <Redirect to={WELCOME_ROUTE} />
  }

  return (
    <Container>
      <StyledCard>
        {showLoader ? (
          <LoaderContainer>
            <Loader size="md" />
          </LoaderContainer>
        ) : (
          <>
            {/* Safe App details */}
            {safeAppDetails && (
              <SafeAppDetails
                iconUrl={safeAppDetails.iconUrl}
                name={safeAppDetails.name}
                description={safeAppDetails?.description}
                availableChains={availableChains}
              />
            )}

            <ActionsContainer>
              <UserSafeContainer>
                <Title size="xs">Use the dApp with your Safe!</Title>
                {isWalletConnected ? <CreateNewSafe safeAppUrl={safeAppUrl} /> : <ConnectWallet />}
              </UserSafeContainer>

              {/* Demo Safe Section */}
              <TryDemoSafe safeAppUrl={safeAppUrl} />
            </ActionsContainer>
          </>
        )}
      </StyledCard>
    </Container>
  )
}

export default SafeAppLandingPage

const Container = styled.main`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`

const StyledCard = styled(Card)`
  flex-grow: 1;
  max-width: 850px;
  border-radius: 20px;
  padding: 50px 58px;
`

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`

const ActionsContainer = styled.div`
  display: flex;
`

const UserSafeContainer = styled.div`
  flex: 1 0 50%;
  text-align: center;
`
