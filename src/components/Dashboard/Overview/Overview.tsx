import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Text, Identicon } from '@gnosis.pm/safe-react-components'

import { currentSafeLoaded, currentSafeWithNames } from 'src/logic/safe/store/selectors'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import Row from 'src/components/layout/Row'
import Col from 'src/components/layout/Col'
import { primaryLite, primaryActive, smallFontSize, md } from 'src/theme/variables'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { nftLoadedSelector, nftTokensSelector } from 'src/logic/collectibles/store/selectors'
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
  position: absolute;
  top: 0;
  right: 0;

  & span {
    bottom: auto;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: relative;
`

const ValueSkeleton = <Skeleton variant="text" width={30} />

const Overview = (): ReactElement => {
  const { address, name, owners, threshold, balances } = useSelector(currentSafeWithNames)
  const loaded = useSelector(currentSafeLoaded)
  const nftTokens = useSelector(nftTokensSelector)
  const nftLoaded = useSelector(nftLoadedSelector)

  return (
    <Container>
      <Row margin="md">
        <Col layout="column">
          <IdenticonContainer>
            {loaded ? (
              <>
                <SafeThreshold>
                  {threshold}/{owners.length}
                </SafeThreshold>
                <Identicon address={address} size="lg" />
              </>
            ) : (
              <Skeleton variant="circle" width="40px" height="40px" />
            )}
          </IdenticonContainer>
          <Text size="xl" strong>
            {loaded ? name : <Skeleton variant="text" />}
          </Text>
          {loaded ? <PrefixedEthHashInfo hash={address} textSize="lg" /> : <Skeleton variant="text" />}
        </Col>
        <Col end="xs">
          <NetworkLabelContainer>
            <NetworkLabel />
          </NetworkLabelContainer>
        </Col>
      </Row>
      <Row>
        <Col layout="column" xs={3}>
          <Text color="inputDefault" size="md">
            Tokens
          </Text>
          <StyledText size="xl">{loaded ? balances.length : ValueSkeleton}</StyledText>
        </Col>
        <Col layout="column" xs={3}>
          <Text color="inputDefault" size="md">
            NFTs
          </Text>
          <StyledText size="xl">{nftLoaded ? nftTokens.length : ValueSkeleton}</StyledText>
        </Col>
      </Row>
    </Container>
  )
}

export default Overview
