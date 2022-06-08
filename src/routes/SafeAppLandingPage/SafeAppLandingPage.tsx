import { ReactElement, useEffect, useMemo } from 'react'
import { Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { Card, Loader } from '@gnosis.pm/safe-react-components'

import { isValidChainId } from 'src/config'
import { WELCOME_ROUTE } from 'src/routes/routes'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { getAppInfoFromUrl } from 'src/routes/safe/components/Apps/utils'
import { setChainId } from 'src/logic/config/utils'
import { useQuery } from 'src/logic/hooks/useQuery'
import useAsync from 'src/logic/hooks/useAsync'
import { trackEvent } from 'src/utils/googleTagManager'
import { SAFE_APPS_EVENTS } from 'src/utils/events/safeApps'
import SafeAppDetails from 'src/routes/SafeAppLandingPage/components/SafeAppsDetails'
import TryDemoSafe from 'src/routes/SafeAppLandingPage/components/TryDemoSafe'
import UserSafeSection from './components/UserSafeSection'

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

  // fetch Safe App details from the Config service
  const { appList, isLoading: isConfigServiceLoading } = useAppList()
  const safeAppDetailsFromConfigService = appList.find(({ url }) => safeAppUrl === url)

  // fetch Safe App details from Manifest.json
  const [safeAppDetailsFromManifest, manifestError, isManifestLoading] = useAsync<SafeApp>(async () => {
    if (safeAppUrl) {
      return getAppInfoFromUrl(safeAppUrl)
    }
    throw new Error('No Safe App URL provided.')
  }, [safeAppUrl])

  const safeAppDetails = safeAppDetailsFromConfigService || safeAppDetailsFromManifest
  const isLoading = isConfigServiceLoading || isManifestLoading
  const isSafeAppMissing = !isLoading && !safeAppDetails && manifestError

  const availableChains = safeAppDetails?.chainIds || []

  const showLoader = isLoading || !safeAppDetails

  useEffect(() => {
    if (!isLoading && safeAppDetails) {
      trackEvent({
        ...SAFE_APPS_EVENTS.SHARED_APP_LANDING,
        label: safeAppDetails?.name,
      })
      trackEvent({
        ...SAFE_APPS_EVENTS.SHARED_APP_CHAIN_ID,
        label: safeAppChainId,
      })
    }
  }, [isLoading, safeAppDetails, safeAppChainId])

  if (!safeAppUrl || !isValidChain || isSafeAppMissing) {
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
              {/* User Safe Section */}
              {safeAppChainId && (
                <UserSafeSection
                  safeAppUrl={safeAppUrl}
                  availableChains={availableChains}
                  safeAppChainId={safeAppChainId}
                />
              )}
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
  flex-wrap: wrap;
`
