import { ReactElement, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Card, Title, Button, Text, Loader } from '@gnosis.pm/safe-react-components'
import Divider from '@material-ui/core/Divider'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'

import SuccessSvg from 'src/assets/icons/safe-created.svg'
import DemoSvg from 'src/assets/icons/demo.svg'
import { getChainById } from 'src/config'
import { getChains } from 'src/config/cache/chains'
import { generateSafeRoute, history, OPEN_SAFE_ROUTE, SAFE_ROUTES, WELCOME_ROUTE } from 'src/routes/routes'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import { SafeApp } from 'src/routes/safe/components/Apps/types'
import { getAppInfoFromUrl } from 'src/routes/safe/components/Apps/utils'
import { userAccountSelector } from 'src/logic/wallets/store/selectors'
import { useStateHandler } from 'src/logic/hooks/useStateHandler'
import { setChainId } from 'src/logic/config/utils'
import ProviderDisconnected from 'src/components/AppLayout/Header/components/ProviderInfo/ProviderDisconnected'
import Provider from 'src/components/AppLayout/Header/components/Provider'
import ConnectDetails from 'src/components/AppLayout/Header/components/ProviderDetails/ConnectDetails'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import Img from 'src/components/layout/Img'
import Link from 'src/components/layout/Link'

const DEMO_SAFE_MAINNET = '0xfF501B324DC6d78dC9F983f140B9211c3EdB4dc7'

const demoSafeAppsPath = generateSafeRoute(SAFE_ROUTES.APPS, {
  shortName: 'eth',
  safeAddress: DEMO_SAFE_MAINNET,
})

function SafeAppLandingPage(): ReactElement {
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const safeAppChainId = query.get('chainId')
  const safeAppUrl = query.get('appUrl')

  // if no valid chainId or Safe App is present in query params we redirect to the Welcome page
  useEffect(() => {
    const isValidChainId = safeAppChainId && getChains().find((chain) => chain.chainId === safeAppChainId)
    const redirectToWelcome = !safeAppUrl || !isValidChainId
    if (redirectToWelcome) {
      history.push(WELCOME_ROUTE)
    }

    // we set the valid Safe App chainId in the state
    if (isValidChainId) {
      setChainId(safeAppChainId)
    }
  }, [safeAppChainId, safeAppUrl])

  const userAddress = useSelector(userAccountSelector)
  const isWalletConnected = !!userAddress
  const { clickAway, open, toggle } = useStateHandler()

  // fetch Safe App details from the Config service
  const { appList, isLoading: isConfigServiceLoading } = useAppList()
  const safeAppDetailsFromConfigService = appList.find(({ url }) => safeAppUrl === url)

  // fetch Safe App details from Manifest.json
  const [safeAppDetailsFromManifest, setSafeAppDetailsFromManifest] = useState<SafeApp>()
  const [isManifestLoading, setIsManifestLoading] = useState(false)
  const [isManifestError, setIsManifestError] = useState(false)
  useEffect(() => {
    const fetchManifest = !isManifestLoading && !safeAppDetailsFromManifest && safeAppUrl && !isManifestError
    if (fetchManifest) {
      const fetchSafeAppDetailsFromManifest = async () => {
        setIsManifestLoading(true)
        try {
          const safeAppDetailsFromManifest = await getAppInfoFromUrl(safeAppUrl)
          setIsManifestLoading(false)
          setSafeAppDetailsFromManifest(safeAppDetailsFromManifest)
        } catch (e) {
          setIsManifestLoading(false)
          setIsManifestError(true)
        }
      }

      fetchSafeAppDetailsFromManifest()
    }
  }, [isManifestLoading, safeAppDetailsFromManifest, safeAppUrl, isManifestError])

  const safeAppDetails = safeAppDetailsFromConfigService || safeAppDetailsFromManifest
  const isLoading = isConfigServiceLoading || isManifestLoading

  // redirect to the Welcome page if the Safe App details are invalid
  useEffect(() => {
    const isSafeAppMissing = !isLoading && appList.length > 0 && !safeAppDetails

    if (isSafeAppMissing && isManifestError) {
      history.push(WELCOME_ROUTE)
    }
  }, [isLoading, appList, safeAppDetails, isManifestError])

  const availableChains = safeAppDetails?.chainIds
  const showAvailableChains = availableChains && availableChains.length > 0

  const userSafe = getUserSafe()

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
              <DetailsContainer>
                <SafeIcon src={safeAppDetails.iconUrl} />
                <DescriptionContainer>
                  <SafeAppTitle size={'sm'}>{safeAppDetails.name}</SafeAppTitle>
                  <div>{safeAppDetails?.description}</div>
                </DescriptionContainer>
              </DetailsContainer>
            )}
            <Separator />

            {/* Available chains */}
            {showAvailableChains && (
              <>
                <ChainLabel size="lg">Available networks</ChainLabel>
                <ChainsContainer>
                  {availableChains.map((chainId) => (
                    <div key={chainId}>
                      <NetworkLabel networkInfo={getChainById(chainId)} />
                    </div>
                  ))}
                </ChainsContainer>
                <Separator />
              </>
            )}

            <ActionsContainer>
              <UserSafeContainer>
                <Title size={'xs'}>Use the dapp with your Safe!</Title>
                {isWalletConnected ? (
                  <>
                    {userSafe ? (
                      <div>not implemented</div>
                    ) : (
                      <>
                        {/* Create new Safe */}
                        <BodyImage>
                          <Img alt="Vault" height={92} src={SuccessSvg} />
                        </BodyImage>

                        <Button
                          data-testid={'create-new-safe-link'}
                          size="lg"
                          color="primary"
                          variant="contained"
                          component={Link}
                          to={OPEN_SAFE_ROUTE}
                        >
                          <Text size="xl" color="white">
                            Create new Safe
                          </Text>
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Connect your Wallet */}
                    <StyledProvider>
                      <Provider
                        info={<ProviderDisconnected />}
                        open={open}
                        toggle={toggle}
                        render={(providerRef) =>
                          providerRef.current && (
                            <Popper
                              anchorEl={providerRef.current}
                              style={{ zIndex: 1301 }}
                              open={open}
                              placement="bottom"
                              popperOptions={{ positionFixed: true }}
                            >
                              <ClickAwayListener mouseEvent="onClick" onClickAway={clickAway} touchEvent={false}>
                                <List component="div">
                                  <ConnectDetails />
                                </List>
                              </ClickAwayListener>
                            </Popper>
                          )
                        }
                      />
                    </StyledProvider>
                  </>
                )}
              </UserSafeContainer>

              {/* Demo Safe */}
              <SafeDemoContainer>
                <Title size={'xs'}>Want to try the app before using it?</Title>

                <BodyImage>
                  <Img alt="Demo" height={92} src={DemoSvg} />
                </BodyImage>
                {safeAppUrl && (
                  <StyledDemoButton
                    data-testid={'open-demo-app-link'}
                    color="primary"
                    component={Link}
                    to={`${demoSafeAppsPath}?appUrl=${encodeURI(safeAppUrl)}`}
                    size="lg"
                    variant="outlined"
                  >
                    Try Demo
                  </StyledDemoButton>
                )}
              </SafeDemoContainer>
            </ActionsContainer>
          </>
        )}
      </StyledCard>
    </Container>
  )
}

export default SafeAppLandingPage

function getUserSafe() {
  // TODO: to be implemented in https://github.com/gnosis/safe-react-apps/issues/416
  return undefined
}

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

const DetailsContainer = styled.div`
  display: flex;
`

const SafeIcon = styled.img`
  width: 90px;
  height: 90px;
`

const SafeAppTitle = styled(Title)`
  margin-top: 0px;
  margin-bottom: 12px;
`

const DescriptionContainer = styled.div`
  padding-left: 66px;
  flex-grow: 1;
`

const Separator = styled(Divider)`
  margin: 32px 0;
`

const ChainLabel = styled(Text)`
  color: #b2bbc0;
`

const ChainsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  && > div {
    margin-top: 12px;
    margin-right: 8px;
  }
`

const ActionsContainer = styled.div`
  display: flex;
`

const UserSafeContainer = styled.div`
  flex: 1 0 50%;
  text-align: center;
`

const SafeDemoContainer = styled.div`
  flex: 1 0 50%;
  text-align: center;
`
const StyledProvider = styled.div`
  width: 300px;
  height: 56px;
  margin: 0 auto;
  border-radius: 8px;
  border: 2px solid #eeeff0;
`

const BodyImage = styled.div`
  margin: 30px 0;
`

const StyledDemoButton = styled(Button)`
  border: 2px solid #008c73;
`
