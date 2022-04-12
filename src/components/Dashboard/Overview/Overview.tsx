import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Text, Identicon } from '@gnosis.pm/safe-react-components'

import { currentSafeLoaded, currentSafeWithNames } from 'src/logic/safe/store/selectors'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import Button from 'src/components/layout/Button'
import { primaryLite, primaryActive, smallFontSize, md } from 'src/theme/variables'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { nftLoadedSelector, nftTokensSelector } from 'src/logic/collectibles/store/selectors'
import { generateSafeRoute, history, SAFE_ROUTES } from 'src/routes/routes'
import { getShortName } from 'src/config'
import { Skeleton } from '@material-ui/lab'

const IdenticonContainer = styled.div`
  position: relative;
  margin-bottom: ${md};
`

const SafeThreshold = styled.div`
  position: absolute;
  left: -6px;
  top: -6px;
  background: ${primaryLite};
  color: ${primaryActive};
  font-size: ${smallFontSize};
  font-weight: bold;
  border-radius: 100%;
  padding: 4px;
  z-index: 2;
  min-width: 24px;
  min-height: 24px;
  box-sizing: border-box;
`

const StyledText = styled(Text)`
  margin-top: 4px;
  font-size: 24px;
  font-weight: bold;
`

const NetworkLabelContainer = styled.div`
  & span {
    bottom: auto;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`

const Overview = (): ReactElement => {
  const { address, name, owners, threshold, balances } = useSelector(currentSafeWithNames)
  const balancesLoaded = useSelector(currentSafeLoaded)
  const nftTokens = useSelector(nftTokensSelector)
  const nftLoaded = useSelector(nftLoadedSelector)

  const navigateToBalances = () => {
    history.push(
      generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, {
        shortName: getShortName(),
        safeAddress: address,
      }),
    )
  }

  return (
    <Container>
      <Row margin="md">
        <Col layout="column">
          <IdenticonContainer>
            {threshold && (
              <SafeThreshold>
                {threshold}/{owners.length}
              </SafeThreshold>
            )}
            <Identicon address={address} size="lg" />
          </IdenticonContainer>
          <Text size="xl" strong>
            {name}
          </Text>
          <PrefixedEthHashInfo hash={address} shortenHash={4} textSize="lg" />
        </Col>
        <Col end="xs">
          <NetworkLabelContainer>
            <NetworkLabel />
          </NetworkLabelContainer>
        </Col>
      </Row>
      <Row>
        <Col layout="column" md={3}>
          <Text color="inputDefault" size="md">
            Tokens
          </Text>
          <StyledText size="xl">{balancesLoaded ? balances.length : <Skeleton variant="text" width={30} />}</StyledText>
        </Col>
        <Col layout="column" md={3}>
          <Text color="inputDefault" size="md">
            NFTs
          </Text>
          <StyledText size="xl">{nftLoaded ? nftTokens.length : <Skeleton variant="text" width={30} />}</StyledText>
        </Col>
        <Col end="xs" md={6}>
          <Button size="md" variant="contained" color="primary" onClick={navigateToBalances}>
            Open Safe
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Overview
