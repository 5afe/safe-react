import { Box } from '@material-ui/core'
import { Text, Tooltip } from '@gnosis.pm/safe-react-components'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import Img from 'src/components/layout/Img'
import { getShortName, _getChainId } from 'src/config'
import useSafeAddress from 'src/logic/currentSession/hooks/useSafeAddress'
import { formatAmount } from 'src/logic/tokens/utils/formatAmount'
import { generateSafeRoute, SAFE_ROUTES } from 'src/routes/routes'
import { extendedSafeTokensSelector } from 'src/routes/safe/container/selector'
import { background } from 'src/theme/variables'
import { isProdGateway, IS_PRODUCTION, SAFE_TOKEN_ADDRESSES } from 'src/utils/constants'
import SafeTokenIcon from './safe_token.svg'
import styled from 'styled-components'
import Track from 'src/components/Track'
import { OVERVIEW_EVENTS } from 'src/utils/events/overview'
import { useAppList } from 'src/routes/safe/components/Apps/hooks/appList/useAppList'
import useSafeTokenAllocation from 'src/components/AppLayout/Header/components/SafeTokenWidget/useSafeTokenAllocation'
import { fromTokenUnit } from 'src/logic/tokens/utils/humanReadableValue'

const isStaging = !IS_PRODUCTION && !isProdGateway()
export const CLAIMING_APP_ID = isStaging ? '61' : '95'

export const getSafeTokenAddress = (chainId: string): string => {
  return SAFE_TOKEN_ADDRESSES[chainId]
}

const StyledWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  height: 100%;
  justify-content: center;
`

const StyledLink = styled(Link)`
  align-self: stretch;
  display: flex;
  border-radius: 8px;
  padding: 0px 8px 0px 8px;
  text-decoration: none;
  background-color: ${background};
  margin: 8px 16px;
  height: 30px;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const SafeTokenWidget = (): JSX.Element | null => {
  const safeTokens = useSelector(extendedSafeTokensSelector)
  const allocation = useSafeTokenAllocation()

  const { allApps } = useAppList()
  const claimingApp = allApps.find((app) => app.id === CLAIMING_APP_ID)

  const chainId = _getChainId()

  const { safeAddress } = useSafeAddress()
  if (!safeAddress) {
    return null
  }

  const appsPath = generateSafeRoute(SAFE_ROUTES.APPS, {
    shortName: getShortName(),
    safeAddress,
  })

  const tokenAddress = getSafeTokenAddress(chainId)
  if (!tokenAddress || !claimingApp) {
    return null
  }

  const url = `${appsPath}?appUrl=${encodeURI(claimingApp.url)}`

  const safeToken = safeTokens.find((token) => {
    return token.address === tokenAddress
  })

  const totalAllocation = Number(fromTokenUnit(allocation, safeToken?.decimals || 18))
  const flooredTotalAllocation = formatAmount(totalAllocation.toFixed(2))

  return (
    <StyledWrapper>
      <Tooltip title={`Open ${claimingApp.name}`}>
        <Track {...OVERVIEW_EVENTS.SAFE_TOKEN_WIDGET}>
          <StyledLink to={url || '#'} aria-describedby={'safe-token-widget'}>
            <Img alt="Safe token" src={SafeTokenIcon} />
            <Text size="xl" strong>
              {flooredTotalAllocation}
            </Text>
          </StyledLink>
        </Track>
      </Tooltip>
    </StyledWrapper>
  )
}

export default SafeTokenWidget
