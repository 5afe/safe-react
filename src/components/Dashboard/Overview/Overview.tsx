import { ReactElement, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Text, Identicon } from '@gnosis.pm/safe-react-components'
import { Box, Grid } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import { currentSafeLoaded, currentSafeWithNames } from 'src/logic/safe/store/selectors'
import { md, lg } from 'src/theme/variables'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { nftLoadedSelector, nftTokensSelector } from 'src/logic/collectibles/store/selectors'
import { Card, WidgetTitle } from 'src/components/Dashboard/styled'
import { WidgetBody, WidgetContainer } from 'src/components/Dashboard/styled'
import Button from 'src/components/layout/Button'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { currentChainId } from 'src/logic/config/store/selectors'
import { getChainById } from 'src/config'
import Threshold from 'src/components/AppLayout/Sidebar/Threshold'

const IdenticonContainer = styled.div`
  position: relative;
  margin-bottom: ${md};
`

const StyledText = styled(Text)`
  margin-top: 8px;
  font-size: 24px;
  font-weight: bold;
  color: #06fc99;
  font-family: monospace;
`
const StyledP = styled(Text)`
  margin-top: 8px;
  font-size: 16px;
  color: #06fc99;
  font-family: monospace;
  
`

const StyledLink = styled(Link)`
  text-decoration: none;
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

  const assetsLink = generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES, { safeAddress: address, shortName })
  const nftsLink = generateSafeRoute(SAFE_ROUTES.ASSETS_BALANCES_COLLECTIBLES, { safeAddress: address, shortName })

  // Native token is always returned even when its balance is 0
  const tokenCount = useMemo(() => balances.filter((token) => token.tokenBalance !== '0').length, [balances])

  return (
    <WidgetContainer>
      <WidgetTitle>&nbsp;</WidgetTitle>

      <WidgetBody>
        {!loaded ? (
          SkeletonOverview
        ) : (
          <Card>
            <Grid container>
              <Grid item xs={12}>
                <IdenticonContainer>
                  <Threshold threshold={threshold} owners={owners.length} size={14} />
                  <Identicon address={address} size="xl" />
                </IdenticonContainer>
                <Box mb={2} overflow="hidden">
                  <StyledText size="xl" strong>
                    {name}
                  </StyledText>
                  <div style={{marginTop: '1rem'}}>
          
                  <StyledP size="lg">
                    {address}
                  </StyledP>
                  </div>
                </Box>
                <NetworkLabelContainer>
                  <NetworkLabel />
                </NetworkLabelContainer>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={3}>
                <StyledLink to={assetsLink}>
                  <StyledP size="lg">
                    Tokens
                  </StyledP>
                  <StyledP size="xl">{tokenCount}</StyledP>
                </StyledLink>
              </Grid>

              <Grid item xs={3}>
                <StyledLink to={nftsLink}>
                  <StyledP size="lg">
                    NFTs
                  </StyledP>
                  {nftTokens && <StyledP size="xl">{nftLoaded ? nftTokens.length : ValueSkeleton}</StyledP>}
                </StyledLink>
              </Grid>

              <Grid item xs={6}>
                <Box display="flex" height={1} alignItems="flex-end" justifyContent="flex-end">
                  <StyledLink to={assetsLink}>
                    <Button size="medium" variant="contained" color="primary">
                      View Assets
                    </Button>
                  </StyledLink>
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
