import { ReactElement, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Card, Loader } from '@gnosis.pm/safe-react-components'

import { isValidChainId } from 'src/config'
import { history, WELCOME_ROUTE } from 'src/routes/routes'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { getAppInfoFromUrl } from 'src/routes/safe/components/Apps/utils'
import { setChainId } from 'src/logic/config/utils'
import useAsync from 'src/logic/hooks/useAsync'
import SafeAppDetails from 'src/routes/SafeAppLandingPage/components/SafeAppsDetails'
import TryDemoSafe from 'src/routes/SafeAppLandingPage/components/TryDemoSafe'
import UserSafe from './components/UserSafe'

const SafeAppLandingPage = (): ReactElement => {
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const safeAppChainId = query.get('chainId')
  const safeAppUrl = query.get('appUrl')

  // if no valid chainId or Safe App url is present in query params we redirect to the Welcome page
  useEffect(() => {
    const isValidChain = isValidChainId(safeAppChainId)
    const redirectToWelcome = !safeAppUrl || !isValidChain
    if (redirectToWelcome) {
      history.push(WELCOME_ROUTE)
    }

    // we set the valid Safe App chainId in the state
    if (isValidChain) {
      setChainId(safeAppChainId)
    }
  }, [safeAppChainId, safeAppUrl])

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
              {/* User Safe Section */}
              <UserSafe />

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
