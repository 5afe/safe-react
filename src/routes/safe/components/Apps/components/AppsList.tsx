import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { useSelector } from 'react-redux'
import { GenericModal, IconText, Loader, Menu } from '@gnosis.pm/safe-react-components'

import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import AppCard from 'src/routes/safe/components/Apps/components/AppCard'
import AddAppIcon from 'src/routes/safe/components/Apps/assets/addApp.svg'
import { useRouteMatch, Link } from 'react-router-dom'
import { SAFELIST_ADDRESS } from 'src/routes/routes'

import { useAppList } from '../hooks/useAppList'
import { SAFE_APP_FETCH_STATUS, SafeApp } from '../types.d'
import AddAppForm from './AddAppForm'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const StyledLink = styled(Link)`
  text-decoration: none;
`

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
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(243px, 1fr));
  column-gap: 20px;
  row-gap: 20px;
  justify-content: space-evenly;
  margin: 0 0 16px 0;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
`
const Breadcrumb = styled.div`
  height: 51px;
`

const AppsList = (): React.ReactElement => {
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const { appList } = useAppList()
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState<boolean>(false)

  const openAddAppModal = () => setIsAddAppModalOpen(true)

  const closeAddAppModal = () => setIsAddAppModalOpen(false)

  const isAppLoading = (app: SafeApp) => SAFE_APP_FETCH_STATUS.LOADING === app.fetchStatus

  if (!appList.length || !safeAddress) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }

  return (
    <Wrapper>
      <Menu>
        {/* TODO: Add navigation breadcrumb. Empty for now to give some top margin */}
        <Breadcrumb />
      </Menu>

      <ContentWrapper>
        <CardsWrapper>
          <AppCard iconUrl={AddAppIcon} onClick={openAddAppModal} buttonText="Add custom app" iconSize="lg" />

          {appList
            .filter((a) => a.fetchStatus !== SAFE_APP_FETCH_STATUS.ERROR)
            .map((a) => (
              <StyledLink key={a.url} to={`${matchSafeWithAddress?.url}/apps?appUrl=${encodeURI(a.url)}`}>
                <AppCard isLoading={isAppLoading(a)} iconUrl={a.iconUrl} name={a.name} description={a.description} />
              </StyledLink>
            ))}
        </CardsWrapper>

        <IconText
          color="secondary"
          iconSize="sm"
          iconType="info"
          text="These are third-party apps, which means they are not owned, controlled, maintained or audited by Gnosis. Interacting with the apps is at your own risk. Any communication within the Apps is for informational purposes only and must not be construed as investment advice to engage in any transaction."
          textSize="sm"
        />
      </ContentWrapper>

      {isAddAppModalOpen && (
        <GenericModal
          title="Add custom app"
          body={<AddAppForm closeModal={closeAddAppModal} appList={appList} />}
          onClose={closeAddAppModal}
        />
      )}
    </Wrapper>
  )
}

export default AppsList
