import {
  Button,
  Card,
  IconText,
  Loader,
  Menu,
  Text,
  Breadcrumb,
  BreadcrumbElement,
} from '@gnosis.pm/safe-react-components'
import { useState } from 'react'
import styled, { css } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'

import Collapse from 'src/components/Collapse'
import Col from 'src/components/layout/Col'
import { Modal } from 'src/components/Modal'
import { useStateHandler } from 'src/logic/hooks/useStateHandler'
import AddAppIcon from 'src/routes/safe/components/Apps/assets/addApp.svg'
import { SearchInputCard } from './SearchInputCard'
import { NoAppsFound } from './NoAppsFound'
import { SafeApp } from '../types'
import AddAppForm from './AddAppForm'
import { useAppList } from '../hooks/appList/useAppList'
import { useAppsSearch } from '../hooks/useAppsSearch'
import SafeAppCard from 'src/routes/safe/components/Apps/components/SafeAppCard/SafeAppCard'
import { PinnedAppsTutorial } from './PinnedAppsTutorial'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'

export const PINNED_APPS_LIST_TEST_ID = 'safe_apps__pinned-apps-container'
export const ALL_APPS_LIST_TEST_ID = 'safe_apps__all-apps-container'

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

const CardsWrapper = styled(motion.div)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(243px, 1fr));
  column-gap: 20px;
  row-gap: 20px;
  justify-content: space-evenly;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
`

const SectionHeading = styled(Text)`
  width: 100%;
  margin: ${({ theme }) => `${theme.margin.xl} 0 ${theme.margin.md} 0`};
`

const CenterIconText = styled(IconText)`
  justify-content: center;
  margin: 16px 55px 20px 0;
`

const AddCustomSafeAppCard = styled(Card)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 190px;
  padding: 0;
  flex-direction: column;
  box-shadow: none;
`

const AddCustomAppLogo = styled.img`
  height: 90px;
  margin-bottom: 4px;
`

type AppListProps = {
  onRemoveApp: (appUrl: string) => void
}

const AppsList = ({ onRemoveApp }: AppListProps): React.ReactElement => {
  const { safeAddress } = useSafeAddress()
  const [appSearch, setAppSearch] = useState('')
  const { allApps, appList, removeApp, isLoading, pinnedSafeApps, togglePin, customApps, addCustomApp } = useAppList()
  const apps = useAppsSearch(appList, appSearch)
  const [appToRemove, setAppToRemove] = useState<SafeApp | null>(null)
  const { open: isAddAppModalOpen, toggle: openAddAppModal, clickAway: closeAddAppModal } = useStateHandler()
  const noAppsFound = apps.length === 0 && appSearch
  const showCustomApps = !!customApps.length && !appSearch
  const showPinnedApps = !appSearch

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
        <SearchInputCard value={appSearch} onValueChange={(value) => setAppSearch(value.replace(/\s{2,}/g, ' '))} />

        {showPinnedApps && (
          <Collapse
            title={
              <Text color="placeHolder" strong size="md">
                BOOKMARKED APPS
              </Text>
            }
            defaultExpanded
          >
            {pinnedSafeApps.length === 0 && <PinnedAppsTutorial />}
            <AnimatePresence>
              <CardsWrapper data-testid={PINNED_APPS_LIST_TEST_ID}>
                {pinnedSafeApps.map((pinnedSafeApp) => (
                  <SafeAppCard
                    key={pinnedSafeApp.id}
                    safeApp={pinnedSafeApp}
                    togglePin={togglePin}
                    size="md"
                    isPinned
                  />
                ))}
              </CardsWrapper>
            </AnimatePresence>
          </Collapse>
        )}

        {showCustomApps && (
          <Collapse
            title={
              <Text color="placeHolder" strong size="md">
                CUSTOM APPS
              </Text>
            }
            defaultExpanded
          >
            <AnimatePresence>
              <CardsWrapper>
                {customApps.map((customSafeApp) => (
                  <SafeAppCard
                    key={customSafeApp.id}
                    safeApp={customSafeApp}
                    togglePin={togglePin}
                    onRemove={setAppToRemove}
                    isCustomSafeApp
                    size="md"
                  />
                ))}
              </CardsWrapper>
            </AnimatePresence>
          </Collapse>
        )}

        <SectionHeading color="placeHolder" strong size="md">
          {appSearch ? 'SEARCH RESULTS' : 'ALL APPS'}
        </SectionHeading>
        {noAppsFound && <NoAppsFound query={appSearch} onWalletConnectSearch={() => setAppSearch('WalletConnect')} />}
        <AnimatePresence>
          <CardsWrapper data-testid={ALL_APPS_LIST_TEST_ID}>
            {!appSearch && (
              <AddCustomSafeAppCard>
                <AddCustomAppLogo src={AddAppIcon} alt="Add Custom Safe App logo" />
                <Button size="md" color="primary" variant="contained" onClick={() => openAddAppModal()}>
                  Add custom app
                </Button>
              </AddCustomSafeAppCard>
            )}

            {apps.map((safeApp) => (
              <SafeAppCard
                key={safeApp.id}
                safeApp={safeApp}
                togglePin={togglePin}
                isPinned={pinnedSafeApps.some((pinnedSafeApp) => pinnedSafeApp.id === safeApp.id)}
                size="md"
              />
            ))}
          </CardsWrapper>
        </AnimatePresence>
      </ContentWrapper>

      <CenterIconText
        color="secondary"
        iconSize="sm"
        iconType="info"
        text="These are third-party apps, which means they are not owned, controlled, maintained or audited by Safe. Interacting with the apps is at your own risk. Any communication within the Apps is for informational purposes only and must not be construed as investment advice to engage in any transaction."
        textSize="sm"
      />

      {isAddAppModalOpen && (
        <Modal title="Add app" description="Add a custom app to the list of apps" handleClose={closeAddAppModal}>
          <Modal.Header onClose={closeAddAppModal}>
            <Modal.Header.Title>Add custom app</Modal.Header.Title>
          </Modal.Header>
          <AddAppForm closeModal={closeAddAppModal} appList={allApps} onAddApp={addCustomApp} />
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
              cancelButtonProps={{ testId: 'cancel-btn', onClick: () => setAppToRemove(null) }}
              confirmButtonProps={{
                testId: 'confirm-btn',
                color: 'error',
                onClick: () => {
                  const url = appToRemove.url

                  onRemoveApp(url)
                  removeApp(appToRemove.id, url)
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
