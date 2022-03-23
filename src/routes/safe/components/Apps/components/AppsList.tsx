import { IconText, Loader, Menu, Text, Icon, Breadcrumb, BreadcrumbElement } from '@gnosis.pm/safe-react-components'
import IconButton from '@material-ui/core/IconButton'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, generatePath } from 'react-router-dom'
import styled, { css } from 'styled-components'

import Col from 'src/components/layout/Col'
import { Modal } from 'src/components/Modal'
import { safeAddressFromUrl } from 'src/logic/safe/store/selectors'
import AppCard from 'src/routes/safe/components/Apps/components/AppCard'
import AddAppIcon from 'src/routes/safe/components/Apps/assets/addApp.svg'
import { SAFE_ROUTES } from 'src/routes/routes'

import { useAppList } from '../hooks/useAppList'
import { SAFE_APP_FETCH_STATUS, SafeApp } from '../types'
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
const isCustomApp = (appUrl: string, appsList: SafeApp[]) => {
  return appsList.some(({ url, custom }) => url === appUrl && custom)
}

const AppsList = (): React.ReactElement => {
  const safeAddress = useSelector(safeAddressFromUrl)
  const appsPath = generatePath(SAFE_ROUTES.APPS, {
    safeAddress,
  })
  const { appList, removeApp, isLoading } = useAppList()
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState<boolean>(false)
  const [appToRemove, setAppToRemove] = useState<SafeApp | null>(null)
  const openAddAppModal = () => setIsAddAppModalOpen(true)

  const closeAddAppModal = () => setIsAddAppModalOpen(false)
  if (isLoading || !safeAddress) {
    return (
      <LoadingContainer>
        <Loader size="md" />
      </LoadingContainer>
    )
  }
  return (
    <Wrapper>
      <Menu>
        <Col start="sm" xs={12}>
          <Breadcrumb>
            <BreadcrumbElement iconType="apps" text="Apps" />
          </Breadcrumb>
        </Col>
      </Menu>
      <ContentWrapper>
        <CardsWrapper>
          <AppCard iconUrl={AddAppIcon} onClick={openAddAppModal} buttonText="Add custom app" iconSize="lg" />

          {appList
            .filter((a) => a.fetchStatus !== SAFE_APP_FETCH_STATUS.ERROR)
            .map((a) => (
              <AppContainer key={a.url}>
                <StyledLink key={a.url} to={`${appsPath}?appUrl=${encodeURI(a.url)}`}>
                  <AppCard isLoading={isAppLoading(a)} iconUrl={a.iconUrl} name={a.name} description={a.description} />
                </StyledLink>
                {isCustomApp(a.url, appList) && (
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
          text="These are third-party apps, which means they are not owned, controlled, maintained or audited by Celo. Interacting with the apps is at your own risk. Any communication within the Apps is for informational purposes only and must not be construed as investment advice to engage in any transaction."
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
