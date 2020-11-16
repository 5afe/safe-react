import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { useSelector } from 'react-redux'
import { GenericModal, IconText, Loader, Menu } from '@gnosis.pm/safe-react-components'

import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import AppCard, { TriggerType } from 'src/routes/safe/components/Apps/components/AppCard'
import AddAppIcon from 'src/routes/safe/components/Apps/assets/addApp.svg'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { SAFELIST_ADDRESS } from 'src/routes/routes'

import { useAppList } from '../hooks/useAppList'
import { SAFE_APP_LOADING_STATUS, SafeApp } from '../types.d'
import AddAppForm from './AddAppForm'

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  column-gap: 20px;
  row-gap: 20px;
  justify-content: space-evenly;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  align-items: center;
`

const AppsList = (): React.ReactElement => {
  const history = useHistory()
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const { appList } = useAppList()
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState<boolean>(false)

  const onAddAppHandler = (url: string) => () => {
    const goToApp = `${matchSafeWithAddress?.url}/apps?appUrl=${encodeURI(url)}`
    history.push(goToApp)
  }

  const openAddAppModal = () => setIsAddAppModalOpen(true)

  const closeAddAppModal = () => setIsAddAppModalOpen(false)

  const isAppLoading = (app: SafeApp) =>
    [SAFE_APP_LOADING_STATUS.ADDED, SAFE_APP_LOADING_STATUS.LOADING].includes(app.loadingStatus)

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
        {/* TODO: Add navigation breadcrumb. Empty for now to give top margin */}
        <div />
      </Menu>

      <ContentWrapper>
        <CardsWrapper>
          <AppCard
            iconUrl={AddAppIcon}
            onClick={openAddAppModal}
            buttonText="Add custom app"
            iconSize="lg"
            actionTrigger={TriggerType.Button}
          />

          {appList.map((a) => (
            <AppCard
              isLoading={isAppLoading(a)}
              key={a.url}
              iconUrl={a.iconUrl}
              name={a.name}
              description={a.description}
              onClick={onAddAppHandler(a.url)}
              actionTrigger={TriggerType.Content}
            />
          ))}
        </CardsWrapper>

        <IconText
          color="secondary"
          iconSize="sm"
          iconType="info"
          text="These are third-party apps, which means they are not owned, controlled, maintained or audited by Gnosis. Interacting with the apps is at your own risk."
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
