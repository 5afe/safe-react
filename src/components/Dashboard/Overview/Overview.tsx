import { ReactElement } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Text, Identicon } from '@gnosis.pm/safe-react-components'
import { useHistory } from 'react-router-dom'
import { Box, Grid } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import { currentSafeLoaded, currentSafeWithNames } from 'src/logic/safe/store/selectors'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { primaryLite, primaryActive, smallFontSize, md, lg } from 'src/theme/variables'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { nftLoadedSelector, nftTokensSelector } from 'src/logic/collectibles/store/selectors'
import { Card, DashboardTitle } from 'src/components/Dashboard/styled'
import { WidgetBody, WidgetContainer } from 'src/components/Dashboard/styled'
import Button from 'src/components/layout/Button'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { currentChainId } from 'src/logic/config/store/selectors'
import { getChainById } from 'src/config'

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
  margin-top: 8px;
  font-size: 24px;
  font-weight: bold;
`

const NetworkLabelContainer = styled.div`
  position: absolute;
  top: ${lg};
  right: ${lg};

  & span {
    bottom: auto;
  }
`

const ValueSkeleton = <Skeleton variant="text" width={30} />

const SkeletonOverview = (
  <Card>
    <Grid container>
      <Grid item xs={12}>
        <IdenticonContainer>
          <Skeleton variant="circle" width="48px" height="48px" />
        </IdenticonContainer>

        <Box mb={2}>
          <Text size="xl" strong>
            <Skeleton variant="text" height={28} />
          </Text>
          <Skeleton variant="text" height={21} />
        </Box>
        <NetworkLabelContainer>
          <Skeleton variant="text" width="80px" />
        </NetworkLabelContainer>
      </Grid>
    </Grid>
    <Grid container>
      <Grid item xs={3}>
        <Text color="inputDefault" size="lg">
          Tokens
        </Text>
        <StyledText size="xl">{ValueSkeleton}</StyledText>
      </Grid>
      <Grid item xs={3}>
        <Text color="inputDefault" size="lg">
          NFTs
        </Text>
        <StyledText size="xl">{ValueSkeleton}</StyledText>
      </Grid>
    </Grid>
  </Card>
)

const Overview = (): ReactElement => {
  const { address, name, owners, threshold, balances } = useSelector(currentSafeWithNames)
  const chainId = useSelector(currentChainId)
  const { shortName } = getChainById(chainId)
  const loaded = useSelector(currentSafeLoaded)
  const nftTokens = useSelector(nftTokensSelector)
  const nftLoaded = useSelector(nftLoadedSelector)
  const history = useHistory()

  const handleOpenAssets = (): void => {
    history.push(generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, { safeAddress: address, shortName }))
  }

  return (
    <WidgetContainer>
      <DashboardTitle>Dashboard</DashboardTitle>
      <WidgetBody>
        {!loaded ? (
          SkeletonOverview
        ) : (
          <Card>
            <Grid container>
              <Grid item xs={12}>
                <IdenticonContainer>
                  <SafeThreshold>
                    {threshold}/{owners.length}
                  </SafeThreshold>
                  <Identicon address={address} size="xl" />
                </IdenticonContainer>
                <Box mb={2} overflow="hidden">
                  <Text size="xl" strong>
                    {name}
                  </Text>
                  <PrefixedEthHashInfo hash={address} textSize="xl" textColor="placeHolder" />
                </Box>
                <NetworkLabelContainer>
                  <NetworkLabel />
                </NetworkLabelContainer>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                <Text color="inputDefault" size="lg">
                  Tokens
                </Text>
                <StyledText size="xl">{balances.length}</StyledText>
              </Grid>
              <Grid item xs={3}>
                <Text color="inputDefault" size="lg">
                  NFTs
                </Text>
                {nftTokens && <StyledText size="xl">{nftLoaded ? nftTokens.length : ValueSkeleton}</StyledText>}
              </Grid>
              <Grid item xs={6}>
                <Box display="flex" height={1} alignItems="flex-end" justifyContent="flex-end">
                  <Button size="medium" variant="contained" color="primary" onClick={handleOpenAssets}>
                    View Assets
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Card>
        )}
      </WidgetBody>
    </WidgetContainer>
  )
}

export default Overview
