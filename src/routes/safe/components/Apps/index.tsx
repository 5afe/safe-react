import React, { useMemo } from 'react'
import { IconText, Loader } from '@gnosis.pm/safe-react-components'
import styled, { css } from 'styled-components'
import { useSelector } from 'react-redux'

import AppFrame from './components/AppFrame'
import { useAppList } from './hooks/useAppList'
import { SAFE_APP_LOADING_STATUS } from './types.d'

import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import AppCard from 'src/routes/safe/components/Apps/components/AppCard'
import AddAppIcon from 'src/routes/safe/components/Apps/assets/addApp.svg'
// import { useAnalytics /* SAFE_NAVIGATION_EVENT */ } from 'src/utils/googleAnalytics'

import { useRouteMatch, useHistory, useLocation } from 'react-router-dom'
import { SAFELIST_ADDRESS } from 'src/routes/routes'

const loaderDotsSvg = require('src/routes/opening/assets/loader-dots.svg')

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

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: justify-content-center;
`

const CenteredMT = styled.div`
  ${centerCSS};
  margin-top: 16px;
`

const ContentWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const Apps = (): React.ReactElement => {
  const history = useHistory()
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
  const safeAddress = useSelector(safeParamAddressFromStateSelector)

  const query = useQuery()
  const appUrl = query.get('appUrl')

  const { appList /* onAppAdded, onAppRemoved */ } = useAppList()

  // const { trackEvent } = useAnalytics()

  const apps = useMemo(() => {
    const areAppsLoading = appList.some((app) =>
      [SAFE_APP_LOADING_STATUS.ADDED, SAFE_APP_LOADING_STATUS.LOADING].includes(app.loadingStatus),
    )

    return areAppsLoading
      ? appList.map((app) => ({ ...app, name: 'Loading', iconUrl: loaderDotsSvg }))
      : appList.map((app) => ({ ...app, id: app.url }))
  }, [appList])

  // track GA
  // useEffect(() => {
  //   if (selectedApp) {
  //     trackEvent({ category: SAFE_NAVIGATION_EVENT, action: 'Apps', label: selectedApp.name })
  //   }
  // }, [selectedApp, trackEvent])

  if (!appList.length || !safeAddress) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  if (appUrl) {
    return <AppFrame appUrl={appUrl} />
  }

  return (
    <ContentWrapper>
      <CardsWrapper>
        <AppCard iconUrl={AddAppIcon} onButtonClick={console.log} buttonText="Add custom app" />

        {apps.map((a) => (
          <AppCard
            key={a.url}
            iconUrl={a.iconUrl}
            name={a.name}
            description={a.description}
            onCardClick={() => {
              const goToApp = `${matchSafeWithAddress?.url}/apps?appUrl=${encodeURI(a.url)}`
              history.push(goToApp)
            }}
          />
        ))}
      </CardsWrapper>

      <CenteredMT>
        <IconText
          color="secondary"
          iconSize="sm"
          iconType="info"
          text="These are third-party apps, which means they are not owned, controlled, maintained or audited by Gnosis. Interacting with the apps is at your own risk."
          textSize="sm"
        />
      </CenteredMT>
    </ContentWrapper>
  )
}

export default Apps
