import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { currentSession } from 'src/logic/currentSession/store/selectors'
import styled from 'styled-components'
import { Text, Link, Icon, FixedIcon, Title } from '@gnosis.pm/safe-react-components'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'

const SafeAppsLoadError = (): React.ReactElement => {
  const history = useHistory()
  const { currentShortName, currentSafeAddress } = useSelector(currentSession)
  const handleGoBack = () => {
    history.push(
      generateSafeRoute(SAFE_ROUTES.APPS, {
        safeAddress: currentSafeAddress,
        shortName: currentShortName,
      }),
    )
  }

  return (
    <Wrapper>
      <Content>
        <Title size="md">Safe App could not be loaded.</Title>
        <FixedIcon type="networkError" />

        <div>
          <Text size="xl" as="span">
            In case the problem persists, please reach out to us via{' '}
          </Text>
          <LinkWrapper>
            <a target="_blank" href="https://chat.gnosis-safe.io" rel="noopener noreferrer">
              <Text color="primary" size="lg" as="span">
                Discord
              </Text>
            </a>
            <Icon type="externalLink" color="primary" size="sm" />
          </LinkWrapper>
        </div>

        <Link size="lg" color="primary" onClick={handleGoBack}>
          Go back to the Safe Apps list
        </Link>
      </Content>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Content = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  > * {
    margin-top: 10px;
  }
`

const LinkWrapper = styled.div`
  display: inline-flex;
  margin-bottom: 10px;

  > :first-of-type {
    margin-right: 5px;
  }
`

export default SafeAppsLoadError
