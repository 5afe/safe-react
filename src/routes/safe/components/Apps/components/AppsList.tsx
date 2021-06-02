import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { useSelector } from 'react-redux'
import { IconText, Loader, Menu, Text, Icon } from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'

import { Modal } from 'src/components/Modal'
import { safeParamAddressFromStateSelector } from 'src/logic/safe/store/selectors'
import AppCard from 'src/routes/safe/components/Apps/components/AppCard'
import AddAppIcon from 'src/routes/safe/components/Apps/assets/addApp.svg'
import { useRouteMatch, Link } from 'react-router-dom'
import { SAFELIST_ADDRESS } from 'src/routes/routes'

import { useAppList } from '../hooks/useAppList'
import { SAFE_APP_FETCH_STATUS, SafeApp } from '../types'
import AddAppForm from './AddAppForm'
import { AppData } from '../api/fetchSafeAppsList'

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

const IconBtn = styled(IconButton)`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  padding: 5px;
  opacity: 0;

  transition: opacity 0.2s ease-in-out;
`

const AppContainer = styled.div`
  position: relative;

  &:hover {
    ${IconBtn} {
      opacity: 1;
    }
  }
`

const isAppLoading = (app: SafeApp) => SAFE_APP_FETCH_STATUS.LOADING === app.fetchStatus
const isCustomApp = (appUrl: string, staticAppsList: AppData[]) => !staticAppsList.some(({ url }) => url === appUrl)

const AppsList = (): React.ReactElement => {
  const matchSafeWithAddress = useRouteMatch<{ safeAddress: string }>({ path: `${SAFELIST_ADDRESS}/:safeAddress` })
  const safeAddress = useSelector(safeParamAddressFromStateSelector)
  const { appList, removeApp, staticAppsList } = useAppList()
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState<boolean>(false)
  const [appToRemove, setAppToRemove] = useState<SafeApp | null>(null)

  const openAddAppModal = () => setIsAddAppModalOpen(true)

  const closeAddAppModal = () => setIsAddAppModalOpen(false)

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
              <AppContainer key={a.url}>
                <StyledLink key={a.url} to={`${matchSafeWithAddress?.url}/apps?appUrl=${encodeURI(a.url)}`}>
                  <AppCard isLoading={isAppLoading(a)} iconUrl={a.iconUrl} name={a.name} description={a.description} />
                </StyledLink>
                {isCustomApp(a.url, staticAppsList) && (
                  <IconBtn
                    title="Remove"
                    onClick={(e) => {
                      e.stopPropagation()

                      setAppToRemove(a)
                    }}
                  >
                    <Icon size="sm" type="delete" color="error" />
                  </IconBtn>
                )}
              </AppContainer>
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
        <Modal title="Add app" description="Add a custom app to the list of apps" handleClose={closeAddAppModal}>
          <Modal.Header onClose={closeAddAppModal}>
            <Modal.Header.Title>Add custom app</Modal.Header.Title>
          </Modal.Header>
          <AddAppForm closeModal={closeAddAppModal} appList={appList} />
        </Modal>
      )}

      {appToRemove && (
        <Modal title="Remove app" description="Confirm for the app removal" handleClose={() => setAppToRemove(null)}>
          <Modal.Header onClose={() => setAppToRemove(null)}>
            <Modal.Header.Title>Remove app</Modal.Header.Title>
          </Modal.Header>
          <Modal.Body>
            <Text size="xl">
              This action will remove{' '}
              <Text size="xl" strong as="span">
                {appToRemove.name}
              </Text>{' '}
              from the interface
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Footer.Buttons
              cancelButtonProps={{ onClick: () => setAppToRemove(null) }}
              confirmButtonProps={{
                color: 'error',
                onClick: () => {
                  removeApp(appToRemove.url)
                  setAppToRemove(null)
                },
                text: 'Remove',
              }}
            />
          </Modal.Footer>
        </Modal>
      )}
    </Wrapper>
  )
}

export default AppsList
