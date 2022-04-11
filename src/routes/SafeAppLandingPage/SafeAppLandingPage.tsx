import { ReactElement, useCallback, useEffect } from 'react'
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
import { getChainById, isValidChainId } from 'src/config'
import { demoSafeRoute, history, OPEN_SAFE_ROUTE, WELCOME_ROUTE } from 'src/routes/routes'
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
import { black300, grey400, secondary } from 'src/theme/variables'
import useAsync from 'src/logic/hooks/useAsync'

function SafeAppLandingPage(): ReactElement {
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

    throw 'No Safe App url provided'
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

  const availableChains = safeAppDetails?.chainIds

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
              <UserSafeContainer>
                <Title size="xs">Use the dApp with your Safe!</Title>
                {isWalletConnected ? <CreateNewSafe /> : <ConnectWallet />}
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

const SafeAppDetails = ({ iconUrl, name, description, availableChains }) => {
  const showAvailableChains = availableChains && availableChains.length > 0

  return (
    <>
      <DetailsContainer>
        <SafeIcon src={iconUrl} />
        <DescriptionContainer>
          <SafeAppTitle size="sm">{name}</SafeAppTitle>
          <div>{description}</div>
        </DescriptionContainer>
      </DetailsContainer>
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
    </>
  )
}

const CreateNewSafe = () => {
  return (
    <>
      <BodyImage>
        <Img alt="Vault" height={92} src={SuccessSvg} />
      </BodyImage>

      <Button size="lg" color="primary" variant="contained" component={Link} to={OPEN_SAFE_ROUTE}>
        <Text size="xl" color="white">
          Create new Safe
        </Text>
      </Button>
    </>
  )
}

const ConnectWallet = () => {
  const { clickAway, open, toggle } = useStateHandler()

  return (
    <StyledProvider>
      <Provider
        info={<ProviderDisconnected />}
        open={open}
        toggle={toggle}
        render={(providerRef) =>
          providerRef.current && (
            <StyledPopper
              anchorEl={providerRef.current}
              open={open}
              placement="bottom"
              popperOptions={{ positionFixed: true }}
            >
              <ClickAwayListener onClickAway={clickAway} touchEvent={false}>
                <List component="div">
                  <ConnectDetails />
                </List>
              </ClickAwayListener>
            </StyledPopper>
          )
        }
      />
    </StyledProvider>
  )
}

const TryDemoSafe = ({ safeAppUrl }) => {
  return (
    <SafeDemoContainer>
      <Title size="xs">Want to try the app before using it?</Title>

      <BodyImage>
        <Img alt="Demo" height={92} src={DemoSvg} />
      </BodyImage>
      {safeAppUrl && (
        <StyledDemoButton
          color="primary"
          component={Link}
          to={`${demoSafeRoute}?appUrl=${encodeURI(safeAppUrl)}`}
          size="lg"
          variant="outlined"
        >
          Try Demo
        </StyledDemoButton>
      )}
    </SafeDemoContainer>
  )
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
  color: ${black300};
`

const ChainsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  && > div {
    margin-top: 12px;
    margin-right: 8px;
  }
`

const StyledPopper = styled(Popper)`
  z-index: 1301;
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
  border: 2px solid ${grey400};
`

const BodyImage = styled.div`
  margin: 30px 0;
`

const StyledDemoButton = styled(Button)`
  border: 2px solid ${secondary};
`
